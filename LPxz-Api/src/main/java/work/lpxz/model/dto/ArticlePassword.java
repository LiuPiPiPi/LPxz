package work.lpxz.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 受保护文章密码 DTO
 *
 * @author LPxz
 * @date 2024/1/12
 */
@NoArgsConstructor
@Getter
@Setter
public class ArticlePassword {

    private Long articleId;

    private String password;

}
