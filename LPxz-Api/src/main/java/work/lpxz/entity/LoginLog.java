package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * 登录日志
 *
 * @author LPxz
 * @date 2024/1/13
 */
@NoArgsConstructor
@Getter
@Setter
public class LoginLog {

    private Long id;

    /**
     * 用户名称
     */
    private String username;

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
     * 登录状态
     */
    private Boolean status;

    /**
     * 操作信息
     */
    private String description;

    /**
     * 操作时间
     */
    private Date gmtCreate;

    private String userAgent;

    public LoginLog(String username, String ip, boolean status, String description, String userAgent) {
        this.username = username;
        this.ip = ip;
        this.status = status;
        this.description = description;
        this.gmtCreate = new Date();
        this.userAgent = userAgent;
    }

}
