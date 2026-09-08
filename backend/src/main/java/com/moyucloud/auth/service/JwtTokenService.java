package com.moyucloud.auth.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** 负责 JWT 令牌的生成与校验。 */
@Service
public class JwtTokenService {

    private static final String BEARER_PREFIX = "Bearer ";

    private final String jwtSecret;

    public JwtTokenService(@Value("${moyu.jwt.secret}") String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    /** 创建有效期为八小时的访问令牌。 */
    public String createToken(Long userId, String username) {
        Instant expiresAt = Instant.now().plus(8, ChronoUnit.HOURS);
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .expiration(Date.from(expiresAt))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    /** 校验请求中的 Bearer 令牌。 */
    public void validate(String authorization) {
        parseUserId(authorization);
    }

    /** 校验令牌并返回其中的用户编号。 */
    public Long parseUserId(String authorization) {
        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
        }
        try {
            String subject = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build()
                    .parseSignedClaims(authorization.substring(BEARER_PREFIX.length())).getPayload().getSubject();
            return Long.valueOf(subject);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "登录已失效", exception);
        }
    }
}
