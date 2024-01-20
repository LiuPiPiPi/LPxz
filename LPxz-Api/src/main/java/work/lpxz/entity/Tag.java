package work.lpxz.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
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
public class Tag {

    private Long id;

    /**
     * 标签名称
     */
    private String name;

    /**
     * 标签颜色（与 Semantic UI 提供的颜色对应）
     */
    private String color;

    /**
     * 该标签下的文章列表
     */
    private List<Article> articles = new ArrayList<>();

    /**
     * 创建时间
     */
    private Date gmtCreate;

    /**
     * 更新时间
     */
    private Date gmtModified;

}
