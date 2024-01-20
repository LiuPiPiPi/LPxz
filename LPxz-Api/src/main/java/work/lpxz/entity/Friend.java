package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * @author LPxz
 * @date 2024/1/12
 */
@NoArgsConstructor
@Getter
@Setter
public class Friend {

    private Long id;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 描述
     */
    private String description;

    /**
     * 站点
     */
    private String website;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 公开或隐藏
     */
    private Boolean published;

    /**
     * 浏览次数
     */
    private Integer views;

    /**
     * 创建时间
     */
    private Date gmtCreate;

}
