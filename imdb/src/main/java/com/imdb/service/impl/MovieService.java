package com.imdb.service.impl;

import com.imdb.dto.response.MovieApiResponse;
import com.imdb.dto.response.MovieDetailResponse;
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
import java.util.Map;

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

    @Override
    public MovieApiResponse getMoviesByGenre(Integer genreId, Integer page) {
        try {
            String url = tmdbBaseUrl + "/discover/movie";
            URI uri = UriComponentsBuilder.fromUriString(url)
                    .queryParam("with_genres", genreId)
                    .queryParam("language", "en-US")
                    .queryParam("page", page != null ? page : 1)
                    .queryParam("sort_by", "popularity.desc")
                    .build()
                    .toUri();

            log.info("Fetching movies by genre {} from TMDB: {}", genreId, uri);
            ResponseEntity<MovieApiResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    MovieApiResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching movies by genre", e);
            throw new RuntimeException("Failed to fetch movies by genre", e);
        }
    }

    @Override
    public MovieApiResponse searchMovies(String query, Integer page) {
        try {
            String url = tmdbBaseUrl + "/search/movie";
            URI uri = UriComponentsBuilder.fromUriString(url)
                    .queryParam("query", query)
                    .queryParam("language", "en-US")
                    .queryParam("page", page != null ? page : 1)
                    .build()
                    .toUri();

            log.info("Searching movies with query '{}' from TMDB: {}", query, uri);
            ResponseEntity<MovieApiResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    MovieApiResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error searching movies", e);
            throw new RuntimeException("Failed to search movies", e);
        }
    }

    @Override
    public MovieDetailResponse getMovieDetail(Long movieId) {
        try {
            String url = tmdbBaseUrl + "/movie/{movieId}";

            URI uri = UriComponentsBuilder.fromUriString(url)
                    .queryParam("language", "en-US")
                    .buildAndExpand(movieId)
                    .toUri();

            ResponseEntity<Map> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    Map.class);

            Map body = response.getBody();

            return mapToMovieDetail(body);

        } catch (Exception e) {
            log.error("Error fetching movie detail", e);
            throw new RuntimeException("Failed to fetch movie detail", e);
        }
    }

    @Override
    public MovieApiResponse filterMovies(String genreIds, Integer year, String country, Integer page) {
        try {
            String url = tmdbBaseUrl + "/discover/movie";
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                    .queryParam("language", "en-US")
                    .queryParam("page", page != null ? page : 1)
                    .queryParam("sort_by", "popularity.desc");

            // Add genre filter if provided
            if (genreIds != null && !genreIds.isEmpty()) {
                builder.queryParam("with_genres", genreIds);
            }

            // Add year filter if provided
            if (year != null) {
                builder.queryParam("primary_release_year", year);
            }

            // Add country filter if provided (with_origin_country for production country)
            if (country != null && !country.isEmpty()) {
                builder.queryParam("with_origin_country", country);
            }

            URI uri = builder.build().toUri();

            log.info("Filtering movies from TMDB with genres={}, year={}, country={}: {}", genreIds, year, country,
                    uri);
            ResponseEntity<MovieApiResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    MovieApiResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error filtering movies", e);
            throw new RuntimeException("Failed to filter movies", e);
        }
    }

    private MovieDetailResponse mapToMovieDetail(Map body) {
        MovieDetailResponse dto = new MovieDetailResponse();

        dto.setId(Long.valueOf(body.get("id").toString()));
        dto.setTitle((String) body.get("title"));
        dto.setOverview((String) body.get("overview"));
        dto.setPosterPath((String) body.get("poster_path"));
        dto.setBackdropPath((String) body.get("backdrop_path"));
        dto.setVoteAverage(Double.valueOf(body.get("vote_average").toString()));
        dto.setReleaseDate((String) body.get("release_date"));

        if (body.get("runtime") != null) {
            dto.setRuntime(Integer.valueOf(body.get("runtime").toString()));
        }

        return dto;
    }
}
