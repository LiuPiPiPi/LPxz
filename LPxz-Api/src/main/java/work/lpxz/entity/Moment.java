package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * 动态
 *
 * @author LPxz
 * @date 2024/1/12
 */
@NoArgsConstructor
@Getter
@Setter
public class Moment {

    private Long id;

    /**
     * 动态内容
     */
    private String content;

    /**
     * 点赞数
     */
    private Integer likes;

    /**
     * 是否公开
     */
    private Boolean published;

    /**
     * 创建时间
     */
    private Date gmtCreate;

    /**
     * 更新时间
     */
    private Date gmtModified;
}
