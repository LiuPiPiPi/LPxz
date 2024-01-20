package work.lpxz.service;

import work.lpxz.entity.Friend;
import work.lpxz.model.dto.FriendDTO;
import work.lpxz.model.vo.FriendInfo;
import work.lpxz.model.vo.FriendVO;

import java.util.List;

/**
 * 友链业务层
 *
 * @author LPxz
 * @date 2024/1/18
 */
public interface FriendService {

    List<Friend> getFriendList();

    List<FriendVO> getFriendVOList();

    FriendInfo getFriendInfo(boolean cache, boolean md);

    void updateFriendPublishedById(Long friendId, Boolean published);

    void updateFriend(FriendDTO friend);

    void updateViewsByNickname(String nickname);

    void updateFriendInfoContent(String content);

    void updateFriendInfoCommentEnabled(Boolean commentEnabled);

    void saveFriend(Friend friend);

    void deleteFriend(Long id);

}
