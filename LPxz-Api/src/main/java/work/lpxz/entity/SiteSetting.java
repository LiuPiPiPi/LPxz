package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 站点设置
 *
 * @author LPxz
 * @date 2024/1/17
 */
@NoArgsConstructor
@Getter
@Setter
public class SiteSetting {

    private Long id;

    /**
     * 英文名称
     */
    private String nameEn;

    /**
     * 中文名称
     */
    private String nameZh;

    /**
     * 属性值
     */
    private String value;

    /**
     * 类型
     */
    private Integer type;

}
