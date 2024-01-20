package work.lpxz.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 文章可见性 DTO
 *
 * @author LPxz
 * @date 2024/1/12
 */
@NoArgsConstructor
@Getter
@Setter
public class ArticleVisibility {

    /**
     * 赞赏开关
     */
    private Boolean appreciation;

    /**
     * 推荐开关
     */
    private Boolean recommend;

    /**
     * 评论开关
     */
    private Boolean commentEnabled;

    /**
     * 是否置顶
     */
    private Boolean top;

    /**
     * 公开或私密
     */
    private Boolean published;

    /**
     * 密码保护
     */
    private String password;

}
