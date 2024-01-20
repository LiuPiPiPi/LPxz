package work.lpxz.config;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import work.lpxz.model.vo.Result;
import work.lpxz.util.JacksonUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 未登录 拒绝访问
 *
 * @author LPxz
 * @date 2024/1/13
 */
@Component
public class MyAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        Result result = Result.create(403, "请登录");
        out.write(JacksonUtils.writeValueAsString(result));
        out.flush();
        out.close();
    }

}
