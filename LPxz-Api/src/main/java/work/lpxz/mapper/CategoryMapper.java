package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.Category;

import java.util.List;

/**
 * @author LPxz
 * @date 2024/1/13
 */
@Mapper
@Repository
public interface CategoryMapper {

    List<Category> getCategoryList();

    List<Category> getCategoryNameList();

    int saveCategory(Category category);

    Category getCategoryById(Long id);

    Category getCategoryByName(String name);

    int deleteCategoryById(Long id);

    int updateCategory(Category category);

}
