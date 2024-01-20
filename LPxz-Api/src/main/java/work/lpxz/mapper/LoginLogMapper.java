package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import work.lpxz.entity.LoginLog;

import java.util.List;

/**
 * 登录日志持久层
 *
 * @author LPxz
 * @date 2024/1/13
 */
@Mapper
public interface LoginLogMapper {

    List<LoginLog> getLoginLogListByDate(String startDate, String endDate);

    int saveLoginLog(LoginLog log);

    int deleteLoginLogById(Long id);

}
