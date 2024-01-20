package work.lpxz.service;

import java.util.Map;

/**
 * 关于页面业务层
 *
 * @author LPxz
 * @date 2024/1/18
 */
public interface AboutService {

    Map<String, String> getAboutInfo();

    Map<String, String> getAboutSetting();

    void updateAbout(Map<String, String> map);

    boolean getAboutCommentEnabled();

}
