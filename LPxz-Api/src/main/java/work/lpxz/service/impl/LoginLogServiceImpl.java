package work.lpxz.service.impl;

import org.apache.ibatis.exceptions.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.lpxz.entity.LoginLog;
import work.lpxz.mapper.LoginLogMapper;
import work.lpxz.service.LoginLogService;
import work.lpxz.util.IpAddressUtils;
import work.lpxz.util.UserAgentUtils;

import java.util.List;
import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/13
 */
@Service
public class LoginLogServiceImpl implements LoginLogService {

    @Autowired
    LoginLogMapper loginLogMapper;

    @Autowired
    UserAgentUtils userAgentUtils;

    @Override
    public List<LoginLog> getLoginLogListByDate(String startDate, String endDate) {
        return loginLogMapper.getLoginLogListByDate(startDate, endDate);
    }

    @Transactional
    @Override
    public void saveLoginLog(LoginLog log) {
        String ipSource = IpAddressUtils.getCityInfo(log.getIp());
        Map<String, String> userAgentMap = userAgentUtils.parseOsAndBrowser(log.getUserAgent());
        String os = userAgentMap.get("os");
        String browser = userAgentMap.get("browser");
        log.setIpSource(ipSource);
        log.setOs(os);
        log.setBrowser(browser);
        if (loginLogMapper.saveLoginLog(log) != 1) {
            throw new PersistenceException("日志添加失败");
        }
    }

    @Transactional
    @Override
    public void deleteLoginLogById(Long id) {
        if (loginLogMapper.deleteLoginLogById(id) != 1) {
            throw new PersistenceException("删除日志失败");
        }
    }

}
