package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.Article;
import work.lpxz.model.dto.ArticleDTO;
import work.lpxz.model.dto.ArticleView;
import work.lpxz.model.dto.ArticleVisibility;
import work.lpxz.model.vo.*;

import java.util.List;

/**
 * 文章持久层
 *
 * @author LPxz
 * @date 2024/1/12
 */
@Mapper
@Repository
public interface ArticleMapper {

    /**
     * 通过 id 查询文章
     *
     * @param id
     * @return
     */
    Article getArticleById(Long id);

    /**
     * 通过文章 id 查询文章标题
     *
     * @param id
     * @return
     */
    String getTitleByArticleId(Long id);

    /**
     * 通过 id 查询公开的文章
     *
     * @param id
     * @return
     */
    ArticleDetail getArticleByIdAndIsPublished(Long id);

    String getArticlePassword(Long articleId);

    List<Article> getIdAndTitleList();

    /**
     * 通过标题和分类查询文章列表
     *
     * @param title
     * @param categoryId
     * @return
     */
    List<Article> getListByTitleAndCategoryId(String title, Integer categoryId);

    /**
     * 通过关键字查询公开的文章列表
     *
     * @param query
     * @return
     */
    List<SearchArticle> getSearchArticleListByQueryAndIsPublished(String query);

    /**
     * 查询公开的文章列表
     *
     * @return
     */
    List<ArticleInfo> getArticleInfoListByIsPublished();

    List<ArticleInfo> getArticleInfoListByCategoryNameAndIsPublished(String categoryName);

    List<ArticleInfo> getArticleInfoListByTagNameAndIsPublished(String tagName);

    List<ArchiveArticle> getArchiveArticleListByYearMonthAndIsPublished(String yearMonth);
    
    List<ArticleView> getArticleViewsList();

    List<CategoryArticleCount> getCategoryArticleCountList();

    List<String> getGroupYearMonthByIsPublished();

    Boolean getCommentEnabledByArticleId(Long articleId);

    Boolean getPublishedByArticleId(Long articleId);

    int saveArticle(ArticleDTO articleDTO);

    int saveArticleTag(Long articleId, Long tagId);

    int updateArticle(ArticleDTO articleDTO);

    int updateArticleRecommendById(Long articleId, Boolean recommend);

    int updateArticleVisibilityById(Long articleId, ArticleVisibility visibility);

    int updateArticleTopById(Long articleId, Boolean top);

    int updateViews(Long articleId, Integer views);

    int deleteArticleById(Long id);

    int deleteArticleTagByArticleId(Long articleId);

    int countArticle();

    int countArticleByIsPublished();

    int countArticleByCategoryId(Long categoryId);

    int countArticleByTagId(Long tagId);

}
