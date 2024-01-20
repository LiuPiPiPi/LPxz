package work.lpxz.service;

import org.springframework.scheduling.annotation.Async;
import work.lpxz.entity.LoginLog;

import java.util.List;

/**
 * 登录日志业务层
 *
 * @author LPxz
 * @date 2024/1/13
 */
public interface LoginLogService {

    List<LoginLog> getLoginLogListByDate(String startDate, String endDate);

    @Async
    void saveLoginLog(LoginLog log);

    void deleteLoginLogById(Long id);

}
