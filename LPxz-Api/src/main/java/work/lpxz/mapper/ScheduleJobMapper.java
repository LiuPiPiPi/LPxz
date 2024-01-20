package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import work.lpxz.entity.ScheduleJob;

import java.util.List;

/**
 * 定时任务持久层
 *
 * @author LPxz
 * @date 2024/1/19
 */
@Mapper
public interface ScheduleJobMapper {

    List<ScheduleJob> getJobList();

    ScheduleJob getJobById(Long jobId);

    int saveJob(ScheduleJob scheduleJob);

    int updateJob(ScheduleJob scheduleJob);

    int deleteJobById(Long jobId);

    int updateJobStatusById(Long jobId, Boolean status);

}
