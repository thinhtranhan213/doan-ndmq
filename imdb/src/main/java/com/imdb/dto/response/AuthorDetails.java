package com.imdb.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorDetails {

    private String name;
    private String username;
    private String avatar_path;
    private Double rating;
}