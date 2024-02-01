package work.lpxz.service.impl;

import org.apache.ibatis.exceptions.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.lpxz.entity.OperationLog;
import work.lpxz.mapper.OperationLogMapper;
import work.lpxz.service.OperationLogService;
import work.lpxz.util.IpAddressUtils;
import work.lpxz.util.UserAgentUtils;

import java.util.List;
import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/21
 */
@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    OperationLogMapper operationLogMapper;

    @Autowired
    UserAgentUtils userAgentUtils;

    @Override
    public List<OperationLog> getOperationLogListByDate(String startDate, String endDate) {
        return operationLogMapper.getOperationLogListByDate(startDate, endDate);
    }

    @Transactional
    @Override
    public void saveOperationLog(OperationLog log) {
        String ipSource = IpAddressUtils.getCityInfo(log.getIp());
        Map<String, String> userAgentMap = userAgentUtils.parseOsAndBrowser(log.getUserAgent());
        String os = userAgentMap.get("os");
        String browser = userAgentMap.get("browser");
        log.setIpSource(ipSource);
        log.setOs(os);
        log.setBrowser(browser);
        if (operationLogMapper.saveOperationLog(log) != 1) {
            throw new PersistenceException("日志添加失败");
        }
    }

    @Transactional
    @Override
    public void deleteOperationLogById(Long id) {
        if (operationLogMapper.deleteOperationLogById(id) != 1) {
            throw new PersistenceException("删除日志失败");
        }
    }

}
