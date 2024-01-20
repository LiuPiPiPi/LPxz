package work.lpxz.controller;

import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import work.lpxz.annotation.AccessLimit;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.entity.Moment;
import work.lpxz.entity.User;
import work.lpxz.model.vo.PageResult;
import work.lpxz.model.vo.Result;
import work.lpxz.service.MomentService;
import work.lpxz.service.impl.UserServiceImpl;
import work.lpxz.util.JwtUtils;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
public class MomentController {

    @Autowired
    MomentService momentService;

    @Autowired
    UserServiceImpl userService;

    /**
     * 分页查询动态 List
     *
     * @param pageNum 页码
     * @param jwt     站长访问 Token
     * @return
     */
    @VisitLogger(behavior = "访问页面", content = "动态")
    @GetMapping("/moments")
    public Result moments(@RequestParam(defaultValue = "1") Integer pageNum,
                          @RequestHeader(value = "Authorization", defaultValue = "") String jwt) {
        boolean adminIdentity = false;
        if (JwtUtils.judgeTokenIsExist(jwt)) {
            try {
                String subject = JwtUtils.getTokenBody(jwt).getSubject();
                if (subject.startsWith("admin:")) {//站长身份Token
                    String username = subject.replace("admin:", "");
                    User admin = (User) userService.loadUserByUsername(username);
                    if (admin != null) {
                        adminIdentity = true;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        PageInfo<Moment> pageInfo = new PageInfo<>(momentService.getMomentVOList(pageNum, adminIdentity));
        PageResult<Moment> pageResult = new PageResult<>(pageInfo.getPages(), pageInfo.getList());
        return Result.ok("获取成功", pageResult);
    }

    /**
     * 给动态点赞，限制重复点赞
     *
     * @param id 动态id
     * @return
     */
    @AccessLimit(seconds = 86400, maxCount = 1, msg = "不可以重复点赞")
    @VisitLogger(behavior = "点赞动态")
    @PostMapping("/moment/like")
    public Result like(@RequestParam Long id) {
        momentService.addLikeByMomentId(id);
        return Result.ok("点赞成功");
    }

}
