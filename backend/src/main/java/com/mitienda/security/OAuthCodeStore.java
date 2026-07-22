package com.mitienda.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OAuthCodeStore {

    private static final long CODE_TTL_SECONDS = 30;

    private final Map<String, CodeEntry> codes = new ConcurrentHashMap<>();

    public String store(String jwt) {
        String code = UUID.randomUUID().toString();
        codes.put(code, new CodeEntry(jwt, Instant.now()));
        return code;
    }

    public String redeem(String code) {
        CodeEntry entry = codes.remove(code);
        if (entry == null) return null;
        if (Instant.now().isAfter(entry.createdAt().plusSeconds(CODE_TTL_SECONDS))) return null;
        return entry.jwt();
    }

    private record CodeEntry(String jwt, Instant createdAt) {}
}
