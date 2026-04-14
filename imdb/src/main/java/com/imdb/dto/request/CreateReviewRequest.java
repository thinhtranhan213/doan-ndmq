package com.imdb.dto.request;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private String content;
    private Integer rating;
}
