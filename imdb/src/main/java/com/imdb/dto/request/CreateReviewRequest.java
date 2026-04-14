package com.imdb.dto.request;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private String comment;
    private Integer rating;
}
