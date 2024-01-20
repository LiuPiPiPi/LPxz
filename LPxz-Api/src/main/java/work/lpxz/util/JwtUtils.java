package work.lpxz.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Date;

/**
 * JWT 工具类
 * @author LPxz
 * @date 2024/1/12
 */
@Component
public class JwtUtils {

    private static long expireTime;

    private static String secretKey;

    @Value("${token.secretKey}")
    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    @Value("${token.expireTime}")
    public void setExpireTime(long expireTime) {
        this.expireTime = expireTime;
    }

    /**
     * 判断token是否存在
     *
     * @param token
     * @return
     */
    public static boolean judgeTokenIsExist(String token) {
        return token != null && !token.isEmpty() && !"null".equals(token);
    }

    /**
     * 生成token
     *
     * @param subject
     * @return
     */
    public static String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    /**
     * 生成带角色权限的 token
     *
     * @param subject
     * @param authorities
     * @return
     */
    public static String generateToken(String subject, Collection<? extends GrantedAuthority> authorities) {
        StringBuilder sb = new StringBuilder();
        for (GrantedAuthority authority : authorities) {
            sb.append(authority.getAuthority()).append(",");
        }
        return Jwts.builder()
                .setSubject(subject)
                .claim("authorities", sb)
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    /**
     * 生成自定义过期时间 token
     *
     * @param subject
     * @param expireTime
     * @return
     */
    public static String generateToken(String subject, long expireTime) {
        return Jwts.builder()
                .setSubject(subject)
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }


    /**
     * 获取 tokenBody 同时校验 token 是否有效（无效则会抛出异常）
     *
     * @param token
     * @return
     */
    public static Claims getTokenBody(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token.replace("Bearer", "")).getBody();
    }

}
