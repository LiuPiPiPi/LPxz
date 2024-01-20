package work.lpxz.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 文章浏览量 DTO
 *
 * @author LPxz
 * @date 2024/1/19
 */
@NoArgsConstructor
@Getter
@Setter
public class ArticleView {

    private Long id;

    private Integer views;

}
