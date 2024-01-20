package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 关于我
 *
 * @author LPxz
 * @date 2024/1/18
 */
@NoArgsConstructor
@Getter
@Setter
public class About {

    private Long id;

    private String nameEn;

    private String nameZh;

    private String value;

}
