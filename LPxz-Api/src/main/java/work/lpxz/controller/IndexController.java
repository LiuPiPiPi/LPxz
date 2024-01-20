package work.lpxz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import work.lpxz.entity.Category;
import work.lpxz.entity.Tag;
import work.lpxz.model.vo.Result;
import work.lpxz.service.ArticleService;
import work.lpxz.service.CategoryService;
import work.lpxz.service.SiteSettingService;
import work.lpxz.service.TagService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/17
 */
@RestController
public class IndexController {

    @Autowired
    SiteSettingService siteSettingService;

    @Autowired
    ArticleService articleService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    TagService tagService;

    /**
     * 获取站点配置信息、最新推荐文章、分类列表、标签云、随机文章
     *
     * @return
     */
    @GetMapping("/site")
    public Result site() {
        Map<String, Object> map = siteSettingService.getSiteInfo();
        List<Category> categoryList = categoryService.getCategoryList();
        List<Integer> categoryNumList = new ArrayList<>();
        for (Category category : categoryList) {
            int num = articleService.countArticleByCategoryId(category.getId());
            categoryNumList.add(num);
        }
        List<Tag> tagList = tagService.getTagListNotId();
//        List<RandomArticle> randomArticleList = articleService.getRandomArticleListByLimitNumAndIsPublishedAndIsRecommend();
        map.put("categoryList", categoryList);
        map.put("tagList", tagList);
        map.put("categoryNumList", categoryNumList);
//        map.put("randomArticleList", randomArticleList);
        return Result.ok("请求成功", map);
    }

}
