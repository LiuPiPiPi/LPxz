package work.lpxz.service;

import work.lpxz.entity.Moment;

import java.util.List;

/**
 * 动态业务层
 *
 * @author LPxz
 * @date 2024/1/18
 */
public interface MomentService {

    List<Moment> getMomentList();

    List<Moment> getMomentVOList(Integer pageNum, boolean adminIdentity);

    void addLikeByMomentId(Long momentId);

    void updateMomentPublishedById(Long momentId, Boolean published);

    Moment getMomentById(Long id);

    void deleteMomentById(Long id);

    void saveMoment(Moment moment);

    void updateMoment(Moment moment);

}
