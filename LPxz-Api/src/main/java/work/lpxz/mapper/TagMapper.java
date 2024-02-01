package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.Tag;
import work.lpxz.model.vo.TagArticleCount;

import java.util.List;

/**
 * 文章标签持久层
 *
 * @author LPxz
 * @date 2024/1/13
 */
@Mapper
@Repository
public interface TagMapper {

    List<Tag> getTagList();

    List<Tag> getTagListNotId();

    List<Tag> getTagListByArticleId(Long articleId);

    int saveTag(Tag tag);

    Tag getTagById(Long id);

    Tag getTagByName(String name);

    int deleteTagById(Long id);

    int updateTag(Tag tag);

    List<TagArticleCount> getTagArticleCount();

}
