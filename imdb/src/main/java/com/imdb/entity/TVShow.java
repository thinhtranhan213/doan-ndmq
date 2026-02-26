package com.imdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tv_shows")
@Getter
@Setter
public class TVShow extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer startYear;
    private Integer endYear;

    @OneToMany(mappedBy = "tvShow", cascade = CascadeType.ALL)
    private List<Season> seasons = new ArrayList<>();
}