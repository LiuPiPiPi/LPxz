package work.lpxz.service;

import work.lpxz.entity.SiteSetting;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 站点设置业务层
 *
 * @author LPxz
 * @date 2024/1/17
 */
public interface SiteSettingService {

    Map<String, List<SiteSetting>> getList();

    Map<String, Object> getSiteInfo();

    String getWebTitleSuffix();

    void updateSiteSetting(List<LinkedHashMap> siteSettings, List<Integer> deleteIds);

}
