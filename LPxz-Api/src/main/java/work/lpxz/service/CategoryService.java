package work.lpxz.service;

import work.lpxz.entity.Category;

import java.util.List;

/**
 * 文章分类业务层
 *
 * @author LPxz
 * @date 2024/1/17
 */
public interface CategoryService {

    List<Category> getCategoryList();

    @Deprecated
    List<Category> getCategoryNameList();

    void saveCategory(Category category);

    Category getCategoryById(Long id);

    Category getCategoryByName(String name);

    void deleteCategoryById(Long id);

    void updateCategory(Category category);

}
