package work.lpxz.service.impl;

import org.apache.ibatis.exceptions.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.lpxz.entity.ExceptionLog;
import work.lpxz.mapper.ExceptionLogMapper;
import work.lpxz.service.ExceptionLogService;
import work.lpxz.util.IpAddressUtils;
import work.lpxz.util.UserAgentUtils;

import java.util.List;
import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/20
 */
@Service
public class ExceptionLogServiceImpl implements ExceptionLogService {

    @Autowired
    ExceptionLogMapper exceptionLogMapper;

    @Autowired
    UserAgentUtils userAgentUtils;

    @Override
    public List<ExceptionLog> getExceptionLogListByDate(String startDate, String endDate) {
        return exceptionLogMapper.getExceptionLogListByDate(startDate, endDate);
    }

    @Transactional
    @Override
    public void saveExceptionLog(ExceptionLog log) {
        String ipSource = IpAddressUtils.getCityInfo(log.getIp());
        Map<String, String> userAgentMap = userAgentUtils.parseOsAndBrowser(log.getUserAgent());
        String os = userAgentMap.get("os");
        String browser = userAgentMap.get("browser");
        log.setIpSource(ipSource);
        log.setOs(os);
        log.setBrowser(browser);
        if (exceptionLogMapper.saveExceptionLog(log) != 1) {
            throw new PersistenceException("日志添加失败");
        }
    }

    @Transactional
    @Override
    public void deleteExceptionLogById(Long id) {
        if (exceptionLogMapper.deleteExceptionLogById(id) != 1) {
            throw new PersistenceException("删除日志失败");
        }
    }

}
