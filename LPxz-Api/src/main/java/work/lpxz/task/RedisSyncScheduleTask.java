package work.lpxz.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import work.lpxz.config.RedisKeyConfig;
import work.lpxz.service.ArticleService;
import work.lpxz.service.RedisService;

import java.util.Map;
import java.util.Set;

/**
 * @author LPxz
 * @date 2024/1/18
 */
@Component
public class RedisSyncScheduleTask {

    @Autowired
    RedisService redisService;

    @Autowired
    ArticleService articleService;

    /**
     * 从 Redis 同步文章文章浏览量到数据库
     */
    public void syncArticleViewsToDatabase() {
        String redisKey = RedisKeyConfig.ARTICLE_VIEWS_MAP;
        Map articleViewsMap = redisService.getMapByHash(redisKey);
        Set<Integer> keys = articleViewsMap.keySet();
        for (Integer key : keys) {
            Integer views = (Integer) articleViewsMap.get(key);
            articleService.updateViews(key.longValue(), views);
        }
    }

}
