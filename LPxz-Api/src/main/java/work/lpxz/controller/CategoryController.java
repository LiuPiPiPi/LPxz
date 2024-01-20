package work.lpxz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.model.vo.ArticleInfo;
import work.lpxz.model.vo.PageResult;
import work.lpxz.model.vo.Result;
import work.lpxz.service.ArticleService;

/**
 * @author LPxz
 * @date 2024/1/16
 */
@RestController
public class CategoryController {

    @Autowired
    ArticleService articleService;

    /**
     * 根据分类 name 分页查询公开文章列表
     *
     * @param categoryName 分类name
     * @param pageNum      页码
     * @return
     */
    @VisitLogger(behavior = "查看分类")
    @GetMapping("/category")
    public Result category(@RequestParam String categoryName,
                           @RequestParam(defaultValue = "1") Integer pageNum) {
        PageResult<ArticleInfo> pageResult = articleService.getArticleInfoListByCategoryNameAndIsPublished(categoryName, pageNum);
        return Result.ok("请求成功", pageResult);
    }

}
