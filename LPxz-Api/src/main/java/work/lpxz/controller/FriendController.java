package work.lpxz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.model.vo.FriendInfo;
import work.lpxz.model.vo.FriendVO;
import work.lpxz.model.vo.Result;
import work.lpxz.service.FriendService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
public class FriendController {

    @Autowired
    FriendService friendService;

    /**
     * 获取友链页面
     *
     * @return
     */
    @VisitLogger(behavior = "访问页面", content = "友链")
    @GetMapping("/friends")
    public Result friends() {
        List<FriendVO> friendList = friendService.getFriendVOList();
        FriendInfo friendInfo = friendService.getFriendInfo(true, true);
        Map<String, Object> map = new HashMap<>();
        map.put("friendList", friendList);
        map.put("friendInfo", friendInfo);
        return Result.ok("获取成功", map);
    }

}
