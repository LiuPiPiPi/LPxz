package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import work.lpxz.entity.ScheduleJobLog;

import java.util.List;

/**
 * 定时任务日志持久层
 *
 * @author LPxz
 * @date 2024/1/19
 */
@Mapper
public interface ScheduleJobLogMapper {

    List<ScheduleJobLog> getJobLogListByDate(String startDate, String endDate);

    int saveJobLog(ScheduleJobLog jobLog);

    int deleteJobLogByLogId(Long logId);

}
