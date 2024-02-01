package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.OperationLog;

import java.util.List;

/**
 * 操作日志持久层
 *
 * @author LPxz
 * @date 2024/1/21
 */
@Mapper
@Repository
public interface OperationLogMapper {

    List<OperationLog> getOperationLogListByDate(String startDate, String endDate);

    int saveOperationLog(OperationLog log);

    int deleteOperationLogById(Long id);

}
