package work.lpxz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import work.lpxz.annotation.VisitLogger;
import work.lpxz.entity.User;
import work.lpxz.model.dto.ArticlePassword;
import work.lpxz.model.vo.*;
import work.lpxz.service.ArticleService;
import work.lpxz.service.impl.UserServiceImpl;
import work.lpxz.util.JwtUtils;
import work.lpxz.util.StringUtils;

import java.util.List;

/**
 * @author LPxz
 * @date 2024/1/12
 */
@RestController
public class ArticleController {

    @Autowired
    ArticleService articleService;

    @Autowired
    UserServiceImpl userService;

    /**
     * 按置顶、创建时间排序 分页查询文章信息列表
     *
     * @param pageNum 页码
     * @return
     */
    @VisitLogger(behavior = "访问页面", content = "首页")
    @GetMapping("/articles")
    public Result articles(@RequestParam(defaultValue = "1") Integer pageNum) {
        PageResult<ArticleInfo> pageResult = articleService.getArticleInfoListByIsPublished(pageNum);
        return Result.ok("请求成功", pageResult);
    }

    /**
     * 通过 id 查询公开文章详情
     *
     * @param id  文章id
     * @param jwt 密码保护文章的访问Token
     * @return
     */
    @VisitLogger(behavior = "查看文章")
    @GetMapping("/article")
    public Result getArticle(@RequestParam Long id,
                             @RequestHeader(value = "Authorization", defaultValue = "") String jwt) {
        ArticleDetail article = articleService.getArticleByIdAndIsPublished(id);
        // 对密码保护的文章校验 token
        if (!"".equals(article.getPassword())) {
            // 经密码验证后的 Token
            if (JwtUtils.judgeTokenIsExist(jwt)) {
                try {
                    String subject = JwtUtils.getTokenBody(jwt).getSubject();
                    if (subject.startsWith("admin:")) {//站长身份Token
                        String username = subject.replace("admin:", "");
                        User admin = (User) userService.loadUserByUsername(username);
                        if (admin == null) {
                            return Result.create(403, "站长身份Token已失效，请重新登录！");
                        }
                    } else {//经密码验证后的Token
                        Long tokenArticleId = Long.parseLong(subject);
                        //文章id不匹配，验证不通过，可能文章id改变或客户端传递了其它密码保护文章的Token
                        if (!tokenArticleId.equals(id)) {
                            return Result.create(403, "Token不匹配，请重新验证密码！");
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return Result.create(403, "Token已失效，请重新验证密码！");
                }
            } else {
                return Result.create(403, "此文章受密码保护，请验证密码！");
            }
            article.setPassword("");
        }
        articleService.updateViewsToRedis(id);
        return Result.ok("获取成功", article);
    }

    /**
     * 校验受保护文章密码是否正确，正确则返回jwt
     *
     * @param articlePassword 文章id、密码
     * @return
     */
    @VisitLogger(behavior = "校验文章密码")
    @PostMapping("/checkArticlePassword")
    public Result checkArticlePassword(@RequestBody ArticlePassword articlePassword) {
        String password = articleService.getArticlePassword(articlePassword.getArticleId());
        if (password.equals(articlePassword.getPassword())) {
            // 生成有效时间一个月的 Token
            String jwt = JwtUtils.generateToken(articlePassword.getArticleId().toString(), 1000 * 3600 * 24 * 30L);
            return Result.ok("密码正确", jwt);
        } else {
            return Result.create(403, "密码错误");
        }
    }

    /**
     * 按关键字根据文章内容搜索公开且无密码保护的文章文章
     *
     * @param query 关键字字符串
     * @return
     */
    @VisitLogger(behavior = "搜索文章")
    @GetMapping("/searchArticle")
    public Result searchArticle(@RequestParam String query) {
        // 校验关键字字符串合法性
        if (StringUtils.isEmpty(query) || StringUtils.hasSpecialChar(query) || query.trim().length() > 20) {
            return Result.error("参数错误");
        }
        List<SearchArticle> searchArticles = articleService.getSearchArticleListByQueryAndIsPublished(query.trim());
        return Result.ok("获取成功", searchArticles);
    }
}
