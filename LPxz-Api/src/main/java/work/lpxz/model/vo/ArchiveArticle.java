package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 归档文章
 *
 * @author LPxz
 * @date 2024/1/18
 */
@NoArgsConstructor
@Getter
@Setter
public class ArchiveArticle {

    private Long id;

    private String title;

    private String day;

    private String password;

    private Boolean privacy;

}
