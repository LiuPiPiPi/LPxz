package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 标签下文章的数量
 *
 * @author LPxz
 * @date 2024/1/13
 */
@NoArgsConstructor
@Getter
@Setter
public class TagArticleCount {

    private Long id;

    /**
     * 标签名
     */
    private String name;

    /**
     * 标签下文章数量
     */
    private Integer value;

}
