package work.lpxz.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 用于需要记录操作日志的方法
 *
 * @author LPxz
 * @date 2024/1/12
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLogger {

    /**
     * 操作描述
     */
    String value() default "";

}
