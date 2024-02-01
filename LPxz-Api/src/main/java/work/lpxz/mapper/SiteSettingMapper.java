package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.SiteSetting;

import java.util.List;

/**
 * 站点设置持久层
 *
 * @author LPxz
 * @date 2024/1/17
 */
@Mapper
@Repository
public interface SiteSettingMapper {

    List<SiteSetting> getList();

    List<SiteSetting> getFriendInfo();

    String getWebTitleSuffix();

    int updateSiteSetting(SiteSetting siteSetting);

    int deleteSiteSettingById(Integer id);

    int saveSiteSetting(SiteSetting siteSetting);

    int updateFriendInfoContent(String content);

    int updateFriendInfoCommentEnabled(Boolean commentEnabled);

}
