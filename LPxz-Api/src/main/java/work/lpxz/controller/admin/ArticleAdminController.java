package work.lpxz.controller.admin;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import work.lpxz.annotation.OperationLogger;
import work.lpxz.entity.Article;
import work.lpxz.entity.Category;
import work.lpxz.entity.Tag;
import work.lpxz.entity.User;
import work.lpxz.model.dto.ArticleDTO;
import work.lpxz.model.dto.ArticleVisibility;
import work.lpxz.model.vo.Result;
import work.lpxz.service.ArticleService;
import work.lpxz.service.CategoryService;
import work.lpxz.service.TagService;
import work.lpxz.util.StringUtils;

import java.util.*;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
@RequestMapping("/admin")
public class ArticleAdminController {

    @Autowired
    ArticleService articleService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    TagService tagService;

    /**
     * 获取文章列表
     *
     * @param title      按标题模糊查询
     * @param categoryId 按分类id查询
     * @param pageNum    页码
     * @param pageSize   每页个数
     * @return
     */
    @GetMapping("/articles")
    public Result articles(@RequestParam(defaultValue = "") String title,
                        @RequestParam(defaultValue = "") Integer categoryId,
                        @RequestParam(defaultValue = "1") Integer pageNum,
                        @RequestParam(defaultValue = "10") Integer pageSize) {
        String orderBy = "gmt_create desc";
        PageHelper.startPage(pageNum, pageSize, orderBy);
        PageInfo<Article> pageInfo = new PageInfo<>(articleService.getListByTitleAndCategoryId(title, categoryId));
        List<Category> categories = categoryService.getCategoryList();
        Map<String, Object> map = new HashMap<>();
        map.put("articles", pageInfo);
        map.put("categories", categories);
        return Result.ok("请求成功", map);
    }

    /**
     * 删除文章、删除文章下的所有评论、同时维护 article_tag 表
     *
     * @param id 文章id
     * @return
     */
    @OperationLogger("删除文章")
    @DeleteMapping("/article")
    public Result delete(@RequestParam Long id) {
        articleService.deleteArticleTagByArticleId(id);
        articleService.deleteArticleById(id);
        // todo
//        commentService.deleteCommentsByArticleId(id);
        return Result.ok("删除成功");
    }

    /**
     * 获取分类列表和标签列表
     *
     * @return
     */
    @GetMapping("/categoryAndTag")
    public Result categoryAndTag() {
        List<Category> categories = categoryService.getCategoryList();
        List<Tag> tags = tagService.getTagList();
        Map<String, Object> map = new HashMap<>();
        map.put("categories", categories);
        map.put("tags", tags);
        return Result.ok("请求成功", map);
    }

    /**
     * 更新文章置顶状态
     *
     * @param id  文章id
     * @param top 是否置顶
     * @return
     */
    @OperationLogger("更新文章置顶状态")
    @PutMapping("/article/top")
    public Result updateTop(@RequestParam Long id, @RequestParam Boolean top) {
        articleService.updateArticleTopById(id, top);
        return Result.ok("操作成功");
    }

    /**
     * 更新文章推荐状态
     *
     * @param id        文章id
     * @param recommend 是否推荐
     * @return
     */
    @OperationLogger("更新文章推荐状态")
    @PutMapping("/article/recommend")
    public Result updateRecommend(@RequestParam Long id, @RequestParam Boolean recommend) {
        articleService.updateArticleRecommendById(id, recommend);
        return Result.ok("操作成功");
    }

    /**
     * 更新文章可见性状态
     *
     * @param id             文章id
     * @param visibility 文章可见性DTO
     * @return
     */
    @OperationLogger("更新文章可见性状态")
    @PutMapping("article/{id}/visibility")
    public Result updateVisibility(@PathVariable Long id, @RequestBody ArticleVisibility visibility) {
        articleService.updateArticleVisibilityById(id, visibility);
        return Result.ok("操作成功");
    }

    /**
     * 按id获取文章详情
     *
     * @param id 文章id
     * @return
     */
    @GetMapping("/article")
    public Result getArticle(@RequestParam Long id) {
        Article article = articleService.getArticleById(id);
        return Result.ok("获取成功", article);
    }

    /**
     * 保存草稿或发布新文章
     *
     * @param article 文章文章DTO
     * @return
     */
    @OperationLogger("发布文章")
    @PostMapping("/article")
    public Result saveArticle(@RequestBody ArticleDTO article) {
        return getResult(article, "save");
    }

    /**
     * 更新文章
     *
     * @param article 文章文章DTO
     * @return
     */
    @OperationLogger("更新文章")
    @PutMapping("/article")
    public Result updateArticle(@RequestBody ArticleDTO article) {
        return getResult(article, "update");
    }

    /**
     * 执行文章添加或更新操作：校验参数是否合法，添加分类、标签，维护文章标签关联表
     *
     * @param article 文章DTO
     * @param type 添加或更新
     * @return
     */
    private Result getResult(ArticleDTO article, String type) {
        // 验证普通字段
        if (StringUtils.isEmpty(article.getTitle(), article.getContent(), article.getDescription())
                || article.getWords() == null || article.getWords() < 0) {
            return Result.error("参数有误");
        }

        // 处理分类
        Object cate = article.getCate();
        if (cate == null) {
            return Result.error("分类不能为空");
        }
        if (cate instanceof Integer) { // 选择了已存在的分类
            Category c = categoryService.getCategoryById(((Integer) cate).longValue());
            article.setCategory(c);
        } else if (cate instanceof String) { // 添加新分类
            // 查询分类是否已存在
            Category category = categoryService.getCategoryByName((String) cate);
            if (category != null) {
                return Result.error("不可添加已存在的分类");
            }
            Category c = new Category();
            c.setName((String) cate);
            categoryService.saveCategory(c);
            article.setCategory(c);
        } else {
            return Result.error("分类不正确");
        }

        // 处理标签
        List<Object> tagList = article.getTagList();
        List<Tag> tags = new ArrayList<>();
        for (Object t : tagList) {
            if (t instanceof Integer) {//选择了已存在的标签
                Tag tag = tagService.getTagById(((Integer) t).longValue());
                tags.add(tag);
            } else if (t instanceof String) {//添加新标签
                //查询标签是否已存在
                Tag tag1 = tagService.getTagByName((String) t);
                if (tag1 != null) {
                    return Result.error("不可添加已存在的标签");
                }
                Tag tag = new Tag();
                tag.setName((String) t);
                tagService.saveTag(tag);
                tags.add(tag);
            } else {
                return Result.error("标签不正确");
            }
        }

        Date date = new Date();
        if (article.getReadTime() == null || article.getReadTime() < 0) {
            article.setReadTime((int) Math.round(article.getWords() / 200.0)); // 计算阅读时长
        }
        if (article.getViews() == null || article.getViews() < 0) {
            article.setViews(0);
        }
        if ("save".equals(type)) {
//            article.setGmtCreate(date);
            article.setGmtModified(date);
            User user = new User();
            user.setId((long) 1);//个人文章默认只有一个作者
            article.setUser(user);

            articleService.saveArticle(article);
            //关联文章和标签(维护 article_tag 表)
            for (Tag t : tags) {
                articleService.saveArticleTag(article.getId(), t.getId());
            }
            return Result.ok("添加成功");
        } else {
            article.setGmtModified(date);
            articleService.updateArticle(article);
            // 关联文章和标签(维护 article_tag 表)
            articleService.deleteArticleTagByArticleId(article.getId());
            for (Tag t : tags) {
                articleService.saveArticleTag(article.getId(), t.getId());
            }
            return Result.ok("更新成功");
        }
    }

}
