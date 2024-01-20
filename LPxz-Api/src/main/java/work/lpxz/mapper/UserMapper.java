package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import work.lpxz.entity.User;

/**
 * 用户持久层
 *
 * @author LPxz
 * @date 2024/1/13
 */
@Mapper
public interface UserMapper {

    User findByUsername(String username);

}
