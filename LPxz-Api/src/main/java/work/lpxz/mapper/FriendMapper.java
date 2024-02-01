package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.Friend;
import work.lpxz.model.dto.FriendDTO;
import work.lpxz.model.vo.FriendVO;

import java.util.List;

/**
 * 友链持久层
 *
 * @author LPxz
 * @date 2024/1/18
 */
@Mapper
@Repository
public interface FriendMapper {

    List<Friend> getFriendList();

    List<FriendVO> getFriendVOList();

    int updateFriendPublishedById(Long id, Boolean published);

    int saveFriend(Friend friend);

    int updateFriend(FriendDTO friend);

    int deleteFriend(Long id);

    int updateViewsByNickname(String nickname);

}
