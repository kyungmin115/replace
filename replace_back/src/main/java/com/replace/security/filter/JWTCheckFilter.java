package com.replace.security.filter;

import com.google.gson.Gson;
import com.replace.dto.member.MemberDTO;
import com.replace.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod(); // 요청 메서드 가져오기

        log.info("check uri......................." + path);

        // /api/member/ 경로는 JWT 필터를 적용하지 않음
        return path.startsWith("/api/goods") || path.startsWith("/api/performances")
                || path.startsWith("/api/board/list") || (path.matches("/api/board/\\d+") && method.equals("GET") ||
                path.equals("/api/member/login")
                || path.equals("/api/member/register")
                || path.startsWith("/api/products/view/")
                || path.equals("/api/admin/members")
                || path.startsWith("/api/member/check")
                || path.startsWith("/api/member/kakao")
        ); // GET 요청만 필터 제외

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        log.info("------------------------JWTCheckFilter------------------");

        String authHeaderStr = request.getHeader("Authorization");

        try {
            if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
                throw new RuntimeException("Authorization Header is missing or invalid");
            }

            // "Bearer token"에서 토큰 부분만 추출
            String accessToken = authHeaderStr.substring(7);

            // JWT 토큰 검증 및 Claims 추출
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);

            log.info("JWT claims: " + claims);

            // JWT Claims에서 데이터 추출
            String id = (String) claims.get("id"); // m_id
            String email = (String) claims.get("email"); // 부가 정보로 사용
            String pw = (String) claims.get("pw");
            String nickname = (String) claims.get("nickname");
            Boolean social = (Boolean) claims.get("social");
            List<String> roleNames = (List<String>) claims.get("roles");

            // MemberDTO 생성
            MemberDTO memberDTO = new MemberDTO(id, email, pw, nickname, social.booleanValue(), roleNames);

            log.info("-----------------------------------");
            log.info(memberDTO);
            log.info(memberDTO.getAuthorities());

            // Spring Security 인증 객체 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

            // SecurityContextHolder에 인증 정보 설정
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 다음 필터로 전달
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("JWT Check Error..............");
            log.error(e.getMessage());

            // 에러 응답
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }
    }
}
