package work.lpxz.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import work.lpxz.entity.Category;
import work.lpxz.entity.Tag;
import work.lpxz.entity.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 文章 DTO
 *
 * @author LPxz
 * @date 2024/1/19
 */
@NoArgsConstructor
@Getter
@Setter
public class ArticleDTO {

    private Long id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章封面
     */
    private String cover;

    /**
     * 文章正文
     */
    private String content;

    /**
     * 文章描述
     */
    private String description;

    /**
     * 公开或私密
     */
    private Boolean published;

    /**
     * 推荐开关
     */
    private Boolean recommend;

    /**
     * 赞赏开关
     */
    private Boolean appreciation;

    /**
     * 评论开关
     */
    private Boolean commentEnabled;

    /**
     * 是否置顶
     */
    private Boolean top;

    /**
     * 浏览次数
     */
    private Integer views;

    /**
     * 文章字数
     */
    private Integer words;

    /**
     * 阅读时长（分钟）
     */
    private Integer readTime;

    /**
     * 密码保护
     */
    private String password;

    /**
     * 文章作者
     */
    private User user;

    /**
     * 文章分类
     */
    private Category category;

    /**
     * 文章标签
     */
    private List<Tag> tags = new ArrayList<>();

    /**
     * 创建时间
     */
    private Date gmtCreate;

    /**
     * 更新时间
     */
    private Date gmtModified;

    /**
     * 页面展示层传输的分类对象：正常情况下为字符串或分类id
     */
    private Object cate;

    /**
     * 页面展示层传输的标签对象：正常情况下为 List<Integer>标签id 或 List<String>标签名
     */
    private List<Object> tagList;

}
