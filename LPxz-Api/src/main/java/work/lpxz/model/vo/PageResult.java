package work.lpxz.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * 分页结果
 *
 * @author LPxz
 * @date 2024/1/12
 */
@NoArgsConstructor
@Getter
@Setter
public class PageResult<T> {

    /**
     * 总页数
     */
    private Integer totalPage;

    /**
     * 数据
     */
    private List<T> list;

    public PageResult(Integer totalPage, List<T> list) {
        this.totalPage = totalPage;
        this.list = list;
    }

}
