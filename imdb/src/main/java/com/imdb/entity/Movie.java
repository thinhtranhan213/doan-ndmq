package com.imdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "movies")
@Getter
@Setter
public class Movie extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String originalTitle;
    private Integer releaseYear;
    private Integer duration;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long tmdbId;

    private String posterPath;

    @Enumerated(EnumType.STRING)
    private MovieStatus status = MovieStatus.PUBLIC;

    private Double averageRating;
    private Long voteCount;




}
