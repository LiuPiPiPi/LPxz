package work.lpxz.service;

import work.lpxz.entity.Article;
import work.lpxz.model.dto.ArticleDTO;
import work.lpxz.model.dto.ArticleVisibility;
import work.lpxz.model.vo.ArticleDetail;
import work.lpxz.model.vo.ArticleInfo;
import work.lpxz.model.vo.PageResult;
import work.lpxz.model.vo.SearchArticle;

import java.util.List;
import java.util.Map;

/**
 * 文章业务层
 *
 * @author LPxz
 * @date 2024/1/12
 */
public interface ArticleService {

    Article getArticleById(Long id);

    String getTitleByArticleId(Long id);

    ArticleDetail getArticleByIdAndIsPublished(Long id);

    String getArticlePassword(Long articleId);

    List<Article> getListByTitleAndCategoryId(String title, Integer categoryId);

    List<SearchArticle> getSearchArticleListByQueryAndIsPublished(String query);

    List<Article> getIdAndTitleList();

    PageResult<ArticleInfo> getArticleInfoListByIsPublished(Integer pageNum);

    PageResult<ArticleInfo> getArticleInfoListByCategoryNameAndIsPublished(String categoryName, Integer pageNum);

    PageResult<ArticleInfo> getArticleInfoListByTagNameAndIsPublished(String tagName, Integer pageNum);

    Map<String, Object> getArchiveArticleAndCountByIsPublished();

    Boolean getCommentEnabledByArticleId(Long articleId);

    Boolean getPublishedByArticleId(Long articleId);

    void saveArticle(ArticleDTO article);

    void saveArticleTag(Long articleId, Long tagId);

    void updateArticle(ArticleDTO article);

    void updateArticleRecommendById(Long articleId, Boolean recommend);

    void updateArticleVisibilityById(Long articleId, ArticleVisibility visibility);

    void updateArticleTopById(Long articleId, Boolean top);

    void updateViewsToRedis(Long articleId);

    void updateViews(Long articleId, Integer views);

    void deleteArticleById(Long id);

    void deleteArticleTagByArticleId(Long articleId);

    int countArticleByIsPublished();

    int countArticleByCategoryId(Long categoryId);

    int countArticleByTagId(Long tagId);

}
