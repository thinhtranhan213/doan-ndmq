package com.imdb.controller;

import com.imdb.dto.request.CreateReviewRequest;
import com.imdb.dto.response.MovieApiResponse;
import com.imdb.dto.response.ReviewItem;
import com.imdb.dto.response.ReviewResponse;
import com.imdb.service.IMovieService;
import com.imdb.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class PublicMovieController {

    private final IMovieService movieService;
    private final IReviewService reviewService;
    /**
     * Get trending movies
     * 
     * @param timeWindow 'day' or 'week' (default: 'week')
     * @return MovieApiResponse with list of trending movies
     */
    @GetMapping("/trending")
    public ResponseEntity<MovieApiResponse> getTrendingMovies(
            @RequestParam(defaultValue = "week") String timeWindow) {
        MovieApiResponse response = movieService.getTrendingMovies(timeWindow);
        return ResponseEntity.ok(response);
    }

    /**
     * Get top rated movies
     * 
     * @param page page number (default: 1)
     * @return MovieApiResponse with list of top rated movies
     */
    @GetMapping("/top-rated")
    public ResponseEntity<MovieApiResponse> getTopRatedMovies(
            @RequestParam(defaultValue = "1") Integer page) {
        MovieApiResponse response = movieService.getTopRatedMovies(page);
        return ResponseEntity.ok(response);
    }

    /**
     * Get popular movies
     * 
     * @param page page number (default: 1)
     * @return MovieApiResponse with list of popular movies
     */
    @GetMapping("/popular")
    public ResponseEntity<MovieApiResponse> getPopularMovies(
            @RequestParam(defaultValue = "1") Integer page) {
        MovieApiResponse response = movieService.getPopularMovies(page);
        return ResponseEntity.ok(response);
    }

    /**
     * Get movies by genre
     * 
     * @param genreId genre ID
     * @param page page number (default: 1)
     * @return MovieApiResponse with list of movies for the genre
     */
    @GetMapping("/by-genre")
    public ResponseEntity<MovieApiResponse> getMoviesByGenre(
            @RequestParam Integer genreId,
            @RequestParam(defaultValue = "1") Integer page) {
        MovieApiResponse response = movieService.getMoviesByGenre(genreId, page);
        return ResponseEntity.ok(response);
    }

    /**
     * Search movies
     * 
     * @param query search query
     * @param page page number (default: 1)
     * @return MovieApiResponse with search results
     */
    @GetMapping("/search")
    public ResponseEntity<MovieApiResponse> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") Integer page) {
        MovieApiResponse response = movieService.searchMovies(query, page);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> getReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page
    ) {
        return ResponseEntity.ok(reviewService.getMovieReviews(id, page));
    }


}
