package com.imdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlaylistResponse {
    private Long id;
    private String name;
    private boolean contains;
}