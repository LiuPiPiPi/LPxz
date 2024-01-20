package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@NoArgsConstructor
@Getter
@Setter
public class FriendVO {

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

}
