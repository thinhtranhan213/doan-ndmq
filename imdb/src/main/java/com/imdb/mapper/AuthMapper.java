package com.imdb.mapper;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.response.LoginResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "roles", expression =
            "java(user.getAuthorities().stream()" +
                    ".map(a -> a.getAuthority()).toList())")
    LoginResponse toLoginResponse(CustomUserDetails user);
}
