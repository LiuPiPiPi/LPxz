package work.lpxz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.model.vo.Result;
import work.lpxz.service.AboutService;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
public class AboutController {

    @Autowired
    AboutService aboutService;

    /**
     * 获取关于我页面信息
     *
     * @return
     */
    @VisitLogger(behavior = "访问页面", content = "关于我")
    @GetMapping("/about")
    public Result about() {
        return Result.ok("获取成功", aboutService.getAboutInfo());
    }

}
