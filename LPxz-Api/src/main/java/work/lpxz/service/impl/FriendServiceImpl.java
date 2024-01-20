package work.lpxz.service.impl;

import org.apache.ibatis.exceptions.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.lpxz.config.RedisKeyConfig;
import work.lpxz.entity.Friend;
import work.lpxz.entity.SiteSetting;
import work.lpxz.mapper.FriendMapper;
import work.lpxz.mapper.SiteSettingMapper;
import work.lpxz.model.dto.FriendDTO;
import work.lpxz.model.vo.FriendInfo;
import work.lpxz.model.vo.FriendVO;
import work.lpxz.service.FriendService;
import work.lpxz.service.RedisService;
import work.lpxz.util.markdown.MarkdownUtils;

import java.util.Date;
import java.util.List;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    FriendMapper friendMapper;

    @Autowired
    SiteSettingMapper siteSettingMapper;

    @Autowired
    RedisService redisService;

    @Override
    public List<Friend> getFriendList() {
        return friendMapper.getFriendList();
    }

    @Override
    public List<FriendVO> getFriendVOList() {
        return friendMapper.getFriendVOList();
    }

    @Override
    public FriendInfo getFriendInfo(boolean cache, boolean md) {
        String redisKey = RedisKeyConfig.FRIEND_INFO_MAP;
        if (cache) {
            FriendInfo friendInfoFromRedis = redisService.getObjectByValue(redisKey, FriendInfo.class);
            if (friendInfoFromRedis != null) {
                return friendInfoFromRedis;
            }
        }
        List<SiteSetting> siteSettings = siteSettingMapper.getFriendInfo();
        FriendInfo friendInfo = new FriendInfo();
        for (SiteSetting siteSetting : siteSettings) {
            if ("friendContent".equals(siteSetting.getNameEn())) {
                if (md) {
                    friendInfo.setContent(MarkdownUtils.markdownToHtmlExtensions(siteSetting.getValue()));
                } else {
                    friendInfo.setContent(siteSetting.getValue());
                }
            } else if ("friendCommentEnabled".equals(siteSetting.getNameEn())) {
                friendInfo.setCommentEnabled("1".equals(siteSetting.getValue()));
            }
        }
        if (cache && md) {
            redisService.saveObjectToValue(redisKey, friendInfo);
        }
        return friendInfo;
    }

    @Transactional
    @Override
    public void updateFriendPublishedById(Long friendId, Boolean published) {
        if (friendMapper.updateFriendPublishedById(friendId, published) != 1) {
            throw new PersistenceException("操作失败");
        }
    }

    @Transactional
    @Override
    public void updateFriend(FriendDTO friend) {
        if (friendMapper.updateFriend(friend) != 1) {
            throw new PersistenceException("修改失败");
        }
    }

    @Transactional
    @Override
    public void updateViewsByNickname(String nickname) {
        if (friendMapper.updateViewsByNickname(nickname) != 1) {
            throw new PersistenceException("操作失败");
        }
    }

    @Transactional
    @Override
    public void updateFriendInfoContent(String content) {
        if (siteSettingMapper.updateFriendInfoContent(content) != 1) {
            throw new PersistenceException("修改失败");
        }
        deleteFriendInfoRedisCache();
    }

    @Transactional
    @Override
    public void updateFriendInfoCommentEnabled(Boolean commentEnabled) {
        if (siteSettingMapper.updateFriendInfoCommentEnabled(commentEnabled) != 1) {
            throw new PersistenceException("修改失败");
        }
        deleteFriendInfoRedisCache();
    }

    @Transactional
    @Override
    public void saveFriend(Friend friend) {
        friend.setViews(0);
        friend.setGmtCreate(new Date());
        if (friendMapper.saveFriend(friend) != 1) {
            throw new PersistenceException("添加失败");
        }
    }

    @Transactional
    @Override
    public void deleteFriend(Long id) {
        if (friendMapper.deleteFriend(id) != 1) {
            throw new PersistenceException("删除失败");
        }
    }

    /**
     * 删除友链页面缓存
     */
    private void deleteFriendInfoRedisCache() {
        redisService.deleteCacheByKey(RedisKeyConfig.FRIEND_INFO_MAP);
    }

}
