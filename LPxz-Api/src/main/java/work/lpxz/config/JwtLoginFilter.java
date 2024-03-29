package work.lpxz.config;

import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import work.lpxz.entity.LoginLog;
import work.lpxz.entity.User;
import work.lpxz.exception.BadRequestException;
import work.lpxz.model.vo.Result;
import work.lpxz.service.LoginLogService;
import work.lpxz.util.IpAddressUtils;
import work.lpxz.util.JacksonUtils;
import work.lpxz.util.JwtUtils;
import work.lpxz.util.StringUtils;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 登录过滤器
 *
 * @author LPxz
 * @date 2024/1/13
 */
public class JwtLoginFilter extends AbstractAuthenticationProcessingFilter {

    LoginLogService loginLogService;

    ThreadLocal<String> currentUsername = new ThreadLocal<>();

    protected JwtLoginFilter(String defaultFilterProcessesUrl, AuthenticationManager authenticationManager, LoginLogService loginLogService) {
        super(new AntPathRequestMatcher(defaultFilterProcessesUrl));
        setAuthenticationManager(authenticationManager);
        this.loginLogService = loginLogService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException {
        try {
            if (!"POST".equals(request.getMethod())) {
                throw new BadRequestException("请求方法错误");
            }
            User user = JacksonUtils.readValue(request.getInputStream(), User.class);
            currentUsername.set(user.getUsername());
            return getAuthenticationManager().authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (BadRequestException exception) {
            response.setContentType("application/json;charset=utf-8");
            Result result = Result.create(400, "非法请求");
            PrintWriter out = response.getWriter();
            out.write(JacksonUtils.writeValueAsString(result));
            out.flush();
            out.close();
        }
        return null;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException {
        String jwt = JwtUtils.generateToken(authResult.getName(), authResult.getAuthorities());
        response.setContentType("application/json;charset=utf-8");
        User user = (User) authResult.getPrincipal();
        user.setPassword(null);
        Map<String, Object> map = new HashMap<>();
        map.put("user", user);
        map.put("token", jwt);
        Result result = Result.ok("登录成功", map);
        PrintWriter out = response.getWriter();
        out.write(JacksonUtils.writeValueAsString(result));
        out.flush();
        out.close();
        LoginLog log = handleLog(request, true, "登录成功");
        loginLogService.saveLoginLog(log);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException exception) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        String msg = exception.getMessage();
        //登录不成功时，会抛出对应的异常
        if (exception instanceof LockedException) {
            msg = "账号被锁定";
        } else if (exception instanceof CredentialsExpiredException) {
            msg = "密码过期";
        } else if (exception instanceof AccountExpiredException) {
            msg = "账号过期";
        } else if (exception instanceof DisabledException) {
            msg = "账号被禁用";
        } else if (exception instanceof BadCredentialsException) {
            msg = "用户名或密码错误";
        }
        PrintWriter out = response.getWriter();
        out.write(JacksonUtils.writeValueAsString(Result.create(401, msg)));
        out.flush();
        out.close();
        LoginLog log = handleLog(request, false, StringUtils.substring(msg, 0, 50));
        loginLogService.saveLoginLog(log);
    }

    /**
     * 设置LoginLog对象属性
     *
     * @param request     请求对象
     * @param status      登录状态
     * @param description 操作描述
     * @return
     */
    private LoginLog handleLog(HttpServletRequest request, boolean status, String description) {
        String username = currentUsername.get();
        currentUsername.remove();
        String ip = IpAddressUtils.getIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        return new LoginLog(username, ip, status, description, userAgent);
    }

}
