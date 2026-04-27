package com.imdb.dto.projection;

import java.time.LocalDate;

public interface DayStatProjection {
    LocalDate getDay();
    Long getCount();
}
