package work.lpxz.lpxzapi.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * 文章分类实体类
 *
 * @author LPxz
 * @since 2022-09-04
 */

@NoArgsConstructor
@Getter
@Setter
@ToString
public class Category {
	private Long id;

	/**
	 * 分类名称
	 */
	private String name;

	/**
	 * 该分类下的文章
	 */
	private List<Article> articles = new ArrayList<>();
}
