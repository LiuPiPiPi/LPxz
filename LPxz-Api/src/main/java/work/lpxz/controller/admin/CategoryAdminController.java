package work.lpxz.controller.admin;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import work.lpxz.annotation.OperationLogger;
import work.lpxz.entity.Category;
import work.lpxz.model.vo.Result;
import work.lpxz.service.ArticleService;
import work.lpxz.service.CategoryService;
import work.lpxz.util.StringUtils;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@RestController
@RequestMapping("/admin")
public class CategoryAdminController {

    @Autowired
    ArticleService articleService;

    @Autowired
    CategoryService categoryService;

    /**
     * 获取文章分类列表
     *
     * @param pageNum  页码
     * @param pageSize 每页个数
     * @return
     */
    @GetMapping("/categories")
    public Result categories(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
        String orderBy = "id desc";
        PageHelper.startPage(pageNum, pageSize, orderBy);
        PageInfo<Category> pageInfo = new PageInfo<>(categoryService.getCategoryList());
        return Result.ok("请求成功", pageInfo);
    }

    /**
     * 添加新分类
     *
     * @param category 分类实体
     * @return
     */
    @OperationLogger("添加分类")
    @PostMapping("/category")
    public Result saveCategory(@RequestBody Category category) {
        return getResult(category, "save");
    }

    /**
     * 修改分类名称
     *
     * @param category 分类实体
     * @return
     */
    @OperationLogger("修改分类")
    @PutMapping("/category")
    public Result updateCategory(@RequestBody Category category) {
        return getResult(category, "update");
    }

    /**
     * 执行分类添加或更新操作：校验参数是否合法，分类是否已存在
     *
     * @param category 分类实体
     * @param type     添加或更新
     * @return
     */
    private Result getResult(Category category, String type) {
        if (StringUtils.isEmpty(category.getName())) {
            return Result.error("分类名称不能为空");
        }
        // 查询分类是否已存在
        Category categoryTmp = categoryService.getCategoryByName(category.getName());
        // 如果 categoryTmp.getId().equals(category.getId()) == true 就是更新分类
        if (categoryTmp != null && !categoryTmp.getId().equals(category.getId())) {
            return Result.error("该分类已存在");
        }
        if ("save".equals(type)) {
            categoryService.saveCategory(category);
            return Result.ok("分类添加成功");
        } else {
            categoryService.updateCategory(category);
            return Result.ok("分类更新成功");
        }
    }

    /**
     * 按id删除分类
     *
     * @param id 分类id
     * @return
     */
    @OperationLogger("删除分类")
    @DeleteMapping("/category")
    public Result delete(@RequestParam Long id) {
        // 删除存在文章关联的分类后，该文章的查询会出异常
        int num = articleService.countArticleByCategoryId(id);
        if (num != 0) {
            return Result.error("已有文章与此分类关联，不可删除");
        }
        categoryService.deleteCategoryById(id);
        return Result.ok("删除成功");
    }

}
