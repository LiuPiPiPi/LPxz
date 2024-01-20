package work.lpxz.controller.admin;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import work.lpxz.annotation.OperationLogger;
import work.lpxz.entity.Moment;
import work.lpxz.model.vo.Result;
import work.lpxz.service.MomentService;

import java.util.Date;

/**
 * @author LPxz
 * @date 2024/1/19
 */
@RestController
@RequestMapping("/admin")
public class MomentAdminController {

    @Autowired
    MomentService momentService;

    /**
     * 分页查询动态列表
     *
     * @param pageNum  页码
     * @param pageSize 每页条数
     * @return
     */
    @GetMapping("/moments")
    public Result moments(@RequestParam(defaultValue = "1") Integer pageNum,
                          @RequestParam(defaultValue = "10") Integer pageSize) {
        String orderBy = "gmt_create desc";
        PageHelper.startPage(pageNum, pageSize, orderBy);
        PageInfo<Moment> pageInfo = new PageInfo<>(momentService.getMomentList());
        return Result.ok("请求成功", pageInfo);
    }

    /**
     * 更新动态公开状态
     *
     * @param id        动态id
     * @param published 是否公开
     * @return
     */
    @OperationLogger("更新动态公开状态")
    @PutMapping("/moment/published")
    public Result updatePublished(@RequestParam Long id, @RequestParam Boolean published) {
        momentService.updateMomentPublishedById(id, published);
        return Result.ok("操作成功");
    }

    /**
     * 根据id查询动态
     *
     * @param id 动态id
     * @return
     */
    @GetMapping("/moment")
    public Result moment(@RequestParam Long id) {
        return Result.ok("获取成功", momentService.getMomentById(id));
    }

    /**
     * 删除动态
     *
     * @param id 动态id
     * @return
     */
    @OperationLogger("删除动态")
    @DeleteMapping("/moment")
    public Result deleteMoment(@RequestParam Long id) {
        momentService.deleteMomentById(id);
        return Result.ok("删除成功");
    }

    /**
     * 发布动态
     *
     * @param moment 动态实体
     * @return
     */
    @OperationLogger("发布动态")
    @PostMapping("/moment")
    public Result saveMoment(@RequestBody Moment moment) {
        if (moment.getGmtCreate() == null) {
            moment.setGmtCreate(new Date());
        }
        momentService.saveMoment(moment);
        return Result.ok("添加成功");
    }

    /**
     * 更新动态
     *
     * @param moment 动态实体
     * @return
     */
    @OperationLogger("更新动态")
    @PutMapping("/moment")
    public Result updateMoment(@RequestBody Moment moment) {
        if (moment.getGmtCreate() == null) {
            moment.setGmtCreate(new Date());
        }
        momentService.updateMoment(moment);
        return Result.ok("修改成功");
    }

}
