package work.lpxz.lpxzapi.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * 文章标签实体类
 *
 * @author LPxz
 * @since 2022-09-04
 */

@NoArgsConstructor
@Getter
@Setter
@ToString
public class Tag {
    private Long id;

    /**
     * 标签名称
     */
    private String name;

    /**
     * 标签颜色（与 Semantic UI 提供的颜色对应，可选）
     */
    private String color;

    /**
     * 该标签下的文章
     */
    private List<Article> articles = new ArrayList<>();
}
