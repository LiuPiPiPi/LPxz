package work.lpxz.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.ibatis.exceptions.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.lpxz.config.RedisKeyConfig;
import work.lpxz.entity.Article;
import work.lpxz.exception.NotFoundException;
import work.lpxz.mapper.ArticleMapper;
import work.lpxz.model.dto.ArticleDTO;
import work.lpxz.model.dto.ArticleView;
import work.lpxz.model.dto.ArticleVisibility;
import work.lpxz.model.vo.*;
import work.lpxz.service.ArticleService;
import work.lpxz.service.RedisService;
import work.lpxz.service.TagService;
import work.lpxz.task.RedisSyncScheduleTask;
import work.lpxz.util.JacksonUtils;
import work.lpxz.util.markdown.MarkdownUtils;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author LPxz
 * @date 2024/1/12
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    ArticleMapper articleMapper;

    @Autowired
    TagService tagService;

    @Autowired
    RedisService redisService;

    @Autowired
    RedisSyncScheduleTask redisSyncScheduleTask;

    // 每页显示文章简介数量
    private static final int pageSize = 10;

    // 文章简介列表排序方式
    private static final String orderBy = "is_top desc, gmt_create desc";

    // 私密文章提示
    private static final String PRIVATE_ARTICLE_DESCRIPTION = "此文章受密码保护！";

    /**
     * 项目启动时，保存所有文章的浏览量到 Redis
     */
    @PostConstruct
    private void saveArticleViewsToRedis() {
        String redisKey = RedisKeyConfig.ARTICLE_VIEWS_MAP;
        // Redis 中没有存储文章浏览量的 Hash
        if (!redisService.hasKey(redisKey)) {
            // 从数据库中读取并存入 Redis
            Map<Long, Integer> articleViewsMap = getArticleViewsMap();
            redisService.saveMapToHash(redisKey, articleViewsMap);
        }
    }

    private Map<Long, Integer> getArticleViewsMap() {
        List<ArticleView> articleViewList = articleMapper.getArticleViewsList();
        Map<Long, Integer> articleViewsMap = new HashMap<>();
        for (ArticleView articleView : articleViewList) {
            articleViewsMap.put(articleView.getId(), articleView.getViews());
        }
        return articleViewsMap;
    }

    @Override
    public Article getArticleById(Long id) {
        Article article = articleMapper.getArticleById(id);
        if (article == null) {
            throw new NotFoundException("文章不存在");
        }
        // 将浏览量设置为 Redis 中的最新值
        int view = (int) redisService.getValueByHashKey(RedisKeyConfig.ARTICLE_VIEWS_MAP, article.getId());
        article.setViews(view);
        return article;
    }

    @Override
    public String getTitleByArticleId(Long id) {
        return articleMapper.getTitleByArticleId(id);
    }

    @Override
    public ArticleDetail getArticleByIdAndIsPublished(Long id) {
        ArticleDetail article = articleMapper.getArticleByIdAndIsPublished(id);
        if (article == null) {
            throw new NotFoundException("该文章不存在");
        }
        article.setContent(MarkdownUtils.markdownToHtmlExtensions(article.getContent()));
        // 将浏览量设置为 Redis 中的最新值
        int view = (int) redisService.getValueByHashKey(RedisKeyConfig.ARTICLE_VIEWS_MAP, article.getId());
        article.setViews(view);
        return article;
    }


    @Override
    public String getArticlePassword(Long articleId) {
        return null;
    }

    @Override
    public List<Article> getListByTitleAndCategoryId(String title, Integer categoryId) {
        return articleMapper.getListByTitleAndCategoryId(title, categoryId);
    }

    @Override
    public List<SearchArticle> getSearchArticleListByQueryAndIsPublished(String query) {
        List<SearchArticle> searchArticles = articleMapper.getSearchArticleListByQueryAndIsPublished(query);
        for (SearchArticle searchArticle : searchArticles) {
            String content = searchArticle.getContent();
            int contentLength = content.length();
            int index = content.indexOf(query) - 10;
            index = Math.max(index, 0);
            // 以关键字字符串为中心返回21个字
            int end = index + 21;
            end = Math.min(end, contentLength - 1);
            searchArticle.setContent(content.substring(index, end));
        }
        return searchArticles;
    }

    @Override
    public List<Article> getIdAndTitleList() {
        return articleMapper.getIdAndTitleList();
    }

    @Override
    public PageResult<ArticleInfo> getArticleInfoListByIsPublished(Integer pageNum) {
        String redisKey = RedisKeyConfig.HOME_ARTICLE_INFO_LIST;
        // redis 已有当前页缓存
        PageResult<ArticleInfo> pageResultFromRedis = redisService.getArticleInfoPageResultByHash(redisKey, pageNum);
        if (pageResultFromRedis != null) {
            setArticleViewsFromRedisToPageResult(pageResultFromRedis);
            return pageResultFromRedis;
        }
        // redis 没有缓存，从数据库查询，并添加缓存
        PageHelper.startPage(pageNum, pageSize, orderBy);
        List<ArticleInfo> articleInfos = processArticleInfosPassword(articleMapper.getArticleInfoListByIsPublished());
        PageInfo<ArticleInfo> pageInfo = new PageInfo<>(articleInfos);
        PageResult<ArticleInfo> pageResult = new PageResult<>(pageInfo.getPages(), pageInfo.getList());
        setArticleViewsFromRedisToPageResult(pageResult);
        // 添加首页缓存
        redisService.saveKVToHash(redisKey, pageNum, pageResult);
        return pageResult;
    }

    @Override
    public PageResult<ArticleInfo> getArticleInfoListByCategoryNameAndIsPublished(String categoryName, Integer pageNum) {
        PageHelper.startPage(pageNum, pageSize, orderBy);
        List<ArticleInfo> articleInfos = processArticleInfosPassword(articleMapper.getArticleInfoListByCategoryNameAndIsPublished(categoryName));
        PageInfo<ArticleInfo> pageInfo = new PageInfo<>(articleInfos);
        PageResult<ArticleInfo> pageResult = new PageResult<>(pageInfo.getPages(), pageInfo.getList());
        setArticleViewsFromRedisToPageResult(pageResult);
        return pageResult;
    }

    @Override
    public PageResult<ArticleInfo> getArticleInfoListByTagNameAndIsPublished(String tagName, Integer pageNum) {
        PageHelper.startPage(pageNum, pageSize, orderBy);
        List<ArticleInfo> articleInfos = processArticleInfosPassword(articleMapper.getArticleInfoListByTagNameAndIsPublished(tagName));
        PageInfo<ArticleInfo> pageInfo = new PageInfo<>(articleInfos);
        PageResult<ArticleInfo> pageResult = new PageResult<>(pageInfo.getPages(), pageInfo.getList());
        setArticleViewsFromRedisToPageResult(pageResult);
        return pageResult;
    }

    @Override
    public Map<String, Object> getArchiveArticleAndCountByIsPublished() {
        String redisKey = RedisKeyConfig.ARCHIVE_ARTICLE_MAP;
        Map<String, Object> mapFromRedis = redisService.getMapByValue(redisKey);
        if (mapFromRedis != null) {
            return mapFromRedis;
        }
        Map<String, Object> map = new HashMap<>();
        List<String> groupYearMonth = articleMapper.getGroupYearMonthByIsPublished();
        Map<String, List<ArchiveArticle>> archiveArticleMap = new LinkedHashMap<>();
        for (String s : groupYearMonth) {
            List<ArchiveArticle> archiveArticles = articleMapper.getArchiveArticleListByYearMonthAndIsPublished(s);
            for (ArchiveArticle article : archiveArticles) {
                if (!"".equals(article.getPassword())) {
                    article.setPrivacy(true);
                    article.setPassword("");
                } else {
                    article.setPrivacy(false);
                }
            }
            archiveArticleMap.put(s, archiveArticles);
        }
        Integer count = countArticleByIsPublished();
        map.put("articleMap", archiveArticleMap);
        map.put("count", count);
        redisService.saveMapToValue(redisKey, map);
        return map;
    }

    @Override
    public Boolean getCommentEnabledByArticleId(Long articleId) {
        return articleMapper.getCommentEnabledByArticleId(articleId);
    }

    @Override
    public Boolean getPublishedByArticleId(Long articleId) {
        return articleMapper.getPublishedByArticleId(articleId);
    }

    @Transactional
    @Override
    public void saveArticle(ArticleDTO article) {
        if (articleMapper.saveArticle(article) != 1) {
            throw new PersistenceException("添加文章失败");
        }
        redisService.saveKVToHash(RedisKeyConfig.ARTICLE_VIEWS_MAP, article.getId(), 0);
        deleteArticleRedisCache();
    }

    @Transactional
    @Override
    public void saveArticleTag(Long articleId, Long tagId) {
        if (articleMapper.saveArticleTag(articleId, tagId) != 1) {
            throw new PersistenceException("维护文章标签关联表失败");
        }
    }

    @Transactional
    @Override
    public void updateArticle(ArticleDTO article) {
        if (articleMapper.updateArticle(article) != 1) {
            throw new PersistenceException("更新文章失败");
        }
        deleteArticleRedisCache();
        redisService.saveKVToHash(RedisKeyConfig.ARTICLE_VIEWS_MAP, article.getId(), article.getViews());
    }

    @Transactional
    @Override
    public void updateArticleRecommendById(Long articleId, Boolean recommend) {
        if (articleMapper.updateArticleRecommendById(articleId, recommend) != 1) {
            throw new PersistenceException("操作失败");
        }
    }

    @Transactional
    @Override
    public void updateArticleVisibilityById(Long articleId, ArticleVisibility visibility) {
        if (articleMapper.updateArticleVisibilityById(articleId, visibility) != 1) {
            throw new PersistenceException("操作失败");
        }
        redisService.deleteCacheByKey(RedisKeyConfig.HOME_ARTICLE_INFO_LIST);
//        redisService.deleteCacheByKey(RedisKeyConfig.NEW_ARTICLE_LIST);
        redisService.deleteCacheByKey(RedisKeyConfig.ARCHIVE_ARTICLE_MAP);
    }

    @Transactional
    @Override
    public void updateArticleTopById(Long articleId, Boolean top) {
        if (articleMapper.updateArticleTopById(articleId, top) != 1) {
            throw new PersistenceException("操作失败");
        }
        redisService.deleteCacheByKey(RedisKeyConfig.HOME_ARTICLE_INFO_LIST);
    }

    @Override
    public void updateViewsToRedis(Long articleId) {
        redisService.incrementByHashKey(RedisKeyConfig.ARTICLE_VIEWS_MAP, articleId, 1);
    }

    @Transactional
    @Override
    public void updateViews(Long articleId, Integer views) {
        if (articleMapper.updateViews(articleId, views) != 1) {
            throw new PersistenceException("更新失败");
        }
    }

    @Transactional
    @Override
    public void deleteArticleById(Long id) {
        if (articleMapper.deleteArticleById(id) != 1) {
            throw new NotFoundException("该文章不存在");
        }
        deleteArticleRedisCache();
        redisService.deleteByHashKey(RedisKeyConfig.ARTICLE_VIEWS_MAP, id);
    }

    @Transactional
    @Override
    public void deleteArticleTagByArticleId(Long articleId) {
        if (articleMapper.deleteArticleTagByArticleId(articleId) == 0) {
            throw new PersistenceException("维护文章标签关联表失败");
        }
    }

    @Override
    public int countArticleByIsPublished() {
        return articleMapper.countArticleByIsPublished();
    }

    @Override
    public int countArticleByCategoryId(Long categoryId) {
        return articleMapper.countArticleByCategoryId(categoryId);
    }

    @Override
    public int countArticleByTagId(Long tagId) {
        return articleMapper.countArticleByTagId(tagId);
    }

    /**
     * 将 pageResult 中文章对象的浏览量设置为 redis 中的最新值
     *
     * @param pageResult
     */
    private void setArticleViewsFromRedisToPageResult(PageResult<ArticleInfo> pageResult) {
        String redisKey = RedisKeyConfig.ARTICLE_VIEWS_MAP;
        List<ArticleInfo> articleInfos = pageResult.getList();
        for (int i = 0; i < articleInfos.size(); i++) {
            ArticleInfo articleInfo = JacksonUtils.convertValue(articleInfos.get(i), ArticleInfo.class);
            Long articleId = articleInfo.getId();
            int view = (int) redisService.getValueByHashKey(redisKey, articleId);
            articleInfo.setViews(view);
            articleInfos.set(i, articleInfo);
        }
    }

    private List<ArticleInfo> processArticleInfosPassword(List<ArticleInfo> articleInfos) {
        for (ArticleInfo articleInfo : articleInfos) {
            if (!"".equals(articleInfo.getPassword())) {
                articleInfo.setPrivacy(true);
                articleInfo.setPassword("");
                articleInfo.setDescription(PRIVATE_ARTICLE_DESCRIPTION);
            } else {
                articleInfo.setPrivacy(false);
                articleInfo.setDescription(MarkdownUtils.markdownToHtmlExtensions(articleInfo.getDescription()));
            }
            articleInfo.setTags(tagService.getTagListByArticleId(articleInfo.getId()));
        }
        return articleInfos;
    }

    /**
     * 删除首页缓存、最新推荐缓存、归档页面缓存、文章浏览量缓存
     */
    private void deleteArticleRedisCache() {
        redisService.deleteCacheByKey(RedisKeyConfig.HOME_ARTICLE_INFO_LIST);
        redisService.deleteCacheByKey(RedisKeyConfig.NEW_ARTICLE_LIST);
        redisService.deleteCacheByKey(RedisKeyConfig.ARCHIVE_ARTICLE_MAP);
    }
}
