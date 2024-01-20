package work.lpxz.model.bean;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * 个人资料
 *
 * @author LPxz
 * @date 2024/1/17
 */
@NoArgsConstructor
@Getter
@Setter
public class Introduction {

    private String avatar;

    private String name;

    private String github;

    private String qq;

    private String bilibili;

    private String netease;

    private String email;

    private List<String> rollText = new ArrayList<>();

    private List<Favorite> favorites = new ArrayList<>();

}
