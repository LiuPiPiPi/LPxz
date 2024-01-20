package work.lpxz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.model.vo.Result;
import work.lpxz.service.ArticleService;

import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
public class ArchiveController {

    @Autowired
    ArticleService articleService;

    /**
     * 按年月分组归档公开文章 统计公开文章总数
     *
     * @return
     */
    @VisitLogger(behavior = "访问页面", content = "文章归档")
    @GetMapping("/archives")
    public Result archives() {
        Map<String, Object> archiveArticleMap = articleService.getArchiveArticleAndCountByIsPublished();
        return Result.ok("请求成功", archiveArticleMap);
    }

}
