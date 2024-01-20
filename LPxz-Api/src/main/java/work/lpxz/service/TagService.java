package work.lpxz.service;

import work.lpxz.entity.Tag;

import java.util.List;

/**
 * 文章标签业务层
 *
 * @author LPxz
 * @date 2024/1/13
 */
public interface TagService {

    List<Tag> getTagList();

    List<Tag> getTagListNotId();

    List<Tag> getTagListByArticleId(Long articleId);

    void saveTag(Tag tag);

    Tag getTagById(Long id);

    Tag getTagByName(String name);

    void deleteTagById(Long id);

    void updateTag(Tag tag);

}
