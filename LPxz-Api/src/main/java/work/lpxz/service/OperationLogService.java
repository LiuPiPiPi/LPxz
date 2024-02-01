package work.lpxz.service;

import org.springframework.scheduling.annotation.Async;
import work.lpxz.entity.OperationLog;

import java.util.List;

/**
 * 操作日志业务层
 *
 * @author LPxz
 * @date 2024/1/21
 */
public interface OperationLogService {

    List<OperationLog> getOperationLogListByDate(String startDate, String endDate);

    @Async
    void saveOperationLog(OperationLog log);

    void deleteOperationLogById(Long id);

}
