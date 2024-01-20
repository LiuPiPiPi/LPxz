package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import work.lpxz.entity.About;

import java.util.List;

/**
 * 关于页面持久层
 *
 * @author LPxz
 * @date 2024/1/18
 */
@Mapper
public interface AboutMapper {

    List<About> getList();

    int updateAbout(String nameEn, String value);

    String getAboutCommentEnabled();

}
