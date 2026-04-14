package com.imdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id; // movieId
    private Integer page;
    private List<ReviewItem> results;
}
