package work.lpxz.service;

import work.lpxz.entity.ScheduleJob;
import work.lpxz.entity.ScheduleJobLog;

import java.util.List;

/**
 * 定时任务业务层
 *
 * @author LPxz
 * @date 2024/1/19
 */
public interface ScheduleJobService {

    List<ScheduleJob> getJobList();

    void saveJob(ScheduleJob scheduleJob);

    void updateJob(ScheduleJob scheduleJob);

    void deleteJobById(Long jobId);

    void runJobById(Long jobId);

    void updateJobStatusById(Long jobId, Boolean status);

    List<ScheduleJobLog> getJobLogListByDate(String startDate, String endDate);

    void saveJobLog(ScheduleJobLog log);

    void deleteJobLogByLogId(Long logId);

}
