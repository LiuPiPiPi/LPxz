package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 分类和文章数量
 *
 * @author LPxz
 * @date 2024/1/19
 */
@NoArgsConstructor
@Getter
@Setter
public class CategoryArticleCount {

    private Long id;

    /**
     * 分类名
     */
    private String name;

    /**
     * 分类下文章数量
     */
    private Integer value;

}
