package com.imdb.service;

import com.imdb.dto.request.CreateReportRequest;

public interface IReportService {
    void create(CreateReportRequest req);
}
