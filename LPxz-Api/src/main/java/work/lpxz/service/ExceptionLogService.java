package work.lpxz.service;

import org.springframework.scheduling.annotation.Async;
import work.lpxz.entity.ExceptionLog;

import java.util.List;

/**
 * 异常日志业务层
 *
 * @author LPxz
 * @date 2024/1/20
 */
public interface ExceptionLogService {

    List<ExceptionLog> getExceptionLogListByDate(String startDate, String endDate);

    @Async
    void saveExceptionLog(ExceptionLog log);

    void deleteExceptionLogById(Long id);

}
