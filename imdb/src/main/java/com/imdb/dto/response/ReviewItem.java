package com.imdb.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewItem {

    private String id;
    private String author;
    private AuthorDetails author_details;
    private String content;
    private String created_at;
    private String updated_at;
    private String url;
}