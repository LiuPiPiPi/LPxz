package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import work.lpxz.entity.Category;
import work.lpxz.entity.Tag;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 文章详情
 * @author LPxz
 * @date 2024/1/16
 */
@NoArgsConstructor
@Getter
@Setter
public class ArticleDetail {

    private Long id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章正文
     */
    private String content;

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

}
