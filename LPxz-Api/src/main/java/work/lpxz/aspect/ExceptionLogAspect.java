package work.lpxz.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import work.lpxz.annotation.OperationLogger;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.entity.ExceptionLog;
import work.lpxz.service.ExceptionLogService;
import work.lpxz.util.AopUtils;
import work.lpxz.util.IpAddressUtils;
import work.lpxz.util.JacksonUtils;
import work.lpxz.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * AOP 记录异常日志
 *
 * @author LPxz
 * @date 2024/1/21
 */
@Component
@Aspect
public class ExceptionLogAspect {

    @Autowired
    ExceptionLogService exceptionLogService;

    /**
     * 配置切入点
     */
    @Pointcut("execution(* work.lpxz.controller..*.*(..))")
    public void logPointcut() {
    }

    @AfterThrowing(value = "logPointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Exception e) {
        ExceptionLog log = handleLog(joinPoint, e);
        exceptionLogService.saveExceptionLog(log);
    }

    /**
     * 设置 ExceptionLog 对象属性
     *
     * @return
     */
    private ExceptionLog handleLog(JoinPoint joinPoint, Exception e) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String uri = request.getRequestURI();
        String method = request.getMethod();
        String ip = IpAddressUtils.getIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        //todo 使用swagger后，可以直接使用注解上的内容作为 ExceptionLog 的 description
        String description = getDescriptionFromAnnotations(joinPoint);
        String error = StringUtils.getStackTrace(e);
        ExceptionLog log = new ExceptionLog(uri, method, description, error, ip, userAgent);
        Map<String, Object> requestParams = AopUtils.getRequestParams(joinPoint);
        log.setParam(StringUtils.substring(JacksonUtils.writeValueAsString(requestParams), 0, 2000));
        return log;
    }

    private String getDescriptionFromAnnotations(JoinPoint joinPoint) {
        String description = "";
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        OperationLogger operationLogger = method.getAnnotation(OperationLogger.class);
        if (operationLogger != null) {
            description = operationLogger.value();
            return description;
        }
        VisitLogger visitLogger = method.getAnnotation(VisitLogger.class);
        if (visitLogger != null) {
            description = visitLogger.behavior();
            return description;
        }
        return description;
    }

}
