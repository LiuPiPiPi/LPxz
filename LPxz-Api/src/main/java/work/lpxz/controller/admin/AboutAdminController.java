package work.lpxz.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import work.lpxz.annotation.OperationLogger;
import work.lpxz.model.vo.Result;
import work.lpxz.service.AboutService;

import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
@RequestMapping("/admin")
public class AboutAdminController {

    @Autowired
    AboutService aboutService;

    /**
     * 获取关于我页面配置
     *
     * @return
     */
    @GetMapping("/about")
    public Result about() {
        return Result.ok("请求成功", aboutService.getAboutSetting());
    }

    /**
     * 修改关于我页面
     *
     * @param map
     * @return
     */
    @OperationLogger("修改关于我页面")
    @PutMapping("/about")
    public Result updateAbout(@RequestBody Map<String, String> map) {
        aboutService.updateAbout(map);
        return Result.ok("修改成功");
    }

}
