package work.lpxz.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 登录账号密码
 *
 * @author LPxz
 * @date 2024/1/21
 */
@NoArgsConstructor
@Getter
@Setter
public class LoginInfo {

    private String username;

    private String password;
}
