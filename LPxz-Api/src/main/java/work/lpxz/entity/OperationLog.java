package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * 操作日志
 *
 * @author LPxz
 * @date 2024/1/21
 */
@NoArgsConstructor
@Getter
@Setter
public class OperationLog {

    private Long id;

    /**
     * 操作者用户名
     */
    private String username;

    /**
     * 请求接口
     */
    private String uri;

    /**
     * 请求方式
     */
    private String method;

    /**
     * 请求参数
     */
    private String param;

    /**
     * 操作描述
     */
    private String description;

    /**
     * IP
     */
    private String ip;

    /**
     * IP 来源
     */
    private String ipSource;

    /**
     * 操作系统
     */
    private String os;

    /**
     * 浏览器
     */
    private String browser;

    /**
     * 请求耗时（毫秒）
     */
    private Integer times;

    /**
     * 操作时间
     */
    private Date gmtCreate;

    private String userAgent;

    public OperationLog(String username, String uri, String method, String description, String ip, Integer times, String userAgent) {
        this.username = username;
        this.uri = uri;
        this.method = method;
        this.description = description;
        this.ip = ip;
        this.times = times;
        this.gmtCreate = new Date();
        this.userAgent = userAgent;
    }

}
