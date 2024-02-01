package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.ExceptionLog;

import java.util.List;

/**
 * 异常日志持久层
 *
 * @author LPxz
 * @date 2024/1/20
 */
@Mapper
@Repository
public interface ExceptionLogMapper {

    List<ExceptionLog> getExceptionLogListByDate(String startDate, String endDate);

    int saveExceptionLog(ExceptionLog log);

    int deleteExceptionLogById(Long id);

}
