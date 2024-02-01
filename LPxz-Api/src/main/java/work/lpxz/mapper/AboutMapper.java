package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.About;

import java.util.List;

/**
 * 关于页面持久层
 *
 * @author LPxz
 * @date 2024/1/18
 */
@Mapper
@Repository
public interface AboutMapper {

    List<About> getList();

    int updateAbout(String nameEn, String value);

    String getAboutCommentEnabled();

}
