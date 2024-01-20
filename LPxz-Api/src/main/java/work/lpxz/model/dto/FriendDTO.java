package work.lpxz.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 友链 DTO
 *
 * @author LPxz
 * @date 2024/1/19
 */
@NoArgsConstructor
@Getter
@Setter
public class FriendDTO {

    private Long id;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 描述
     */
    private String description;

    /**
     * 站点
     */
    private String website;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 公开或隐藏
     */
    private Boolean published;

}
