package com.imdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "film_overrides")
@Getter
@Setter
public class FilmOverride extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long tmdbId;

    private String title;

    private String posterPath;

    @Column(columnDefinition = "TEXT")
    private String reason;
}