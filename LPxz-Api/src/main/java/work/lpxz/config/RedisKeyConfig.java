package work.lpxz.config;

/**
 * @author LPxz
 * @date 2024/1/13
 */
public class RedisKeyConfig {

    // 首页文章简介列表 分页对象key：homeArticleInfoList : {{1,"第一页的缓存"},{2,"第二页的缓存"}}
    public static final String HOME_ARTICLE_INFO_LIST = "homeArticleInfoList";

    // 分类名列表 key
    public static final String CATEGORY_NAME_LIST = "categoryNameList";

    // 标签云列表 key
    public static final String TAG_CLOUD_LIST = "tagCloudList";

    // 站点信息 key
    public static final String SITE_INFO_MAP = "siteInfoMap";

    // 最新推荐文章 key
    public static final String NEW_ARTICLE_LIST = "newArticleList";

    // 关于我页面 key
    public static final String ABOUT_INFO_MAP = "aboutInfoMap";

    // 友链页面信息 key
    public static final String FRIEND_INFO_MAP = "friendInfoMap";

    // 文章归档 key
    public static final String ARCHIVE_ARTICLE_MAP = "archiveArticleMap";

    // 文章访问量 key
    public static final String ARTICLE_VIEWS_MAP = "articleViewsMap";

    // 访客标识码 key
    public static final String IDENTIFICATION_SET = "identificationSet";

}
