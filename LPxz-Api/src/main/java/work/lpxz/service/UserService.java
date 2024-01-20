package work.lpxz.service;

import work.lpxz.entity.User;

/**
 * 用户业务层
 *
 * @author LPxz
 * @date 2024/1/13
 */
public interface UserService {

    User findUserByUsernameAndPassword(String username, String password);

}
