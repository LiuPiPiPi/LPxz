package work.lpxz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import work.lpxz.entity.Moment;

import java.util.List;

/**
 * 动态持久层
 *
 * @author LPxz
 * @date 2024/1/18
 */
@Mapper
@Repository
public interface MomentMapper {

    List<Moment> getMomentList();

    int addLikeByMomentId(Long momentId);

    int updateMomentPublishedById(Long momentId, Boolean published);

    Moment getMomentById(Long id);

    int deleteMomentById(Long id);

    int saveMoment(Moment moment);

    int updateMoment(Moment moment);

}
