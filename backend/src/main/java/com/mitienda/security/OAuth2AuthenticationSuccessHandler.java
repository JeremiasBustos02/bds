package com.mitienda.security;

import com.mitienda.service.OAuthUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final String FRONTEND_URL = "http://localhost:5173";

    private final OAuthUserService oAuthUserService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String givenName = oAuth2User.getAttribute("given_name");
        String familyName = oAuth2User.getAttribute("family_name");

        if (email == null) {
            response.sendRedirect(FRONTEND_URL
                    + "/auth/callback?error=No+se+pudo+obtener+el+email+de+Google");
            return;
        }

        String jwt = oAuthUserService.loginOrCreateWithGoogle(email, givenName, familyName);
        response.sendRedirect(FRONTEND_URL + "/auth/callback?token=" + jwt);
    }
}
