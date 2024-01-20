package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 关键字搜索文章
 *
 * @author LPxz
 * @date 2024/1/16
 */
@NoArgsConstructor
@Getter
@Setter
public class SearchArticle {

    private Long id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章正文
     */
    private String content;

}
