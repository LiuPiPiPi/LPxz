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
public class TagController {

    @Autowired
    ArticleService articleService;

    /**
     * 根据标签name分页查询公开文章列表
     *
     * @param tagName 标签name
     * @param pageNum 页码
     * @return
     */
    @VisitLogger(behavior = "查看标签")
    @GetMapping("/tag")
    public Result tag(@RequestParam String tagName,
                      @RequestParam(defaultValue = "1") Integer pageNum) {
        PageResult<ArticleInfo> pageResult = articleService.getArticleInfoListByTagNameAndIsPublished(tagName, pageNum);
        return Result.ok("请求成功", pageResult);
    }
}
