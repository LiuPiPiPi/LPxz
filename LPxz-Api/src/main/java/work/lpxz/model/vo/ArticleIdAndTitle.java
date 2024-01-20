package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 评论管理页面按文章标题查询评论
 *
 * @author LPxz
 * @date 2024/1/19
 */
@NoArgsConstructor
@Getter
@Setter
public class ArticleIdAndTitle {

    private Long id;

    private String title;

}
