package com.imdb.service.impl;

import com.imdb.dto.response.MovieApiResponse;
import com.imdb.service.IMovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService implements IMovieService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api-key}")
    private String tmdbApiKey;

    @Value("${tmdb.base-url}")
    private String tmdbBaseUrl;

    private HttpEntity<?> createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + tmdbApiKey);
        headers.set("Content-Type", "application/json;charset=utf-8");
        return new HttpEntity<>(headers);
    }

    @Override
    public MovieApiResponse getTrendingMovies(String timeWindow) {
        try {
            String url = tmdbBaseUrl + "/trending/movie/{timeWindow}";
            URI uri = UriComponentsBuilder.fromUriString(url)
                    .queryParam("language", "en-US")
                    .buildAndExpand(timeWindow)
                    .toUri();

            log.info("Fetching trending movies from TMDB: {}", uri);
            ResponseEntity<MovieApiResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    MovieApiResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching trending movies", e);
            throw new RuntimeException("Failed to fetch trending movies", e);
        }
    }

    @Override
    public MovieApiResponse getTopRatedMovies(Integer page) {
        try {
            String url = tmdbBaseUrl + "/movie/top_rated";
            URI uri = UriComponentsBuilder.fromUriString(url)
                    .queryParam("language", "en-US")
                    .queryParam("page", page != null ? page : 1)
                    .build()
                    .toUri();

            log.info("Fetching top rated movies from TMDB: {}", uri);
            ResponseEntity<MovieApiResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    MovieApiResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching top rated movies", e);
            throw new RuntimeException("Failed to fetch top rated movies", e);
        }
    }

    @Override
    public MovieApiResponse getPopularMovies(Integer page) {
        try {
            String url = tmdbBaseUrl + "/movie/popular";
            URI uri = UriComponentsBuilder.fromUriString(url)
                    .queryParam("language", "en-US")
                    .queryParam("page", page != null ? page : 1)
                    .build()
                    .toUri();

            log.info("Fetching popular movies from TMDB: {}", uri);
            ResponseEntity<MovieApiResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    MovieApiResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching popular movies", e);
            throw new RuntimeException("Failed to fetch popular movies", e);
        }
    }
}
