package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.User;

/**
 * 用户持久层
 *
 * @author LPxz
 * @date 2024/1/13
 */
@Mapper
@Repository
public interface UserMapper {

    User findByUsername(String username);

}
