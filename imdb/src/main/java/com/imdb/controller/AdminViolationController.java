package com.imdb.controller;

import com.imdb.dto.request.ViolationActionRequest;
import com.imdb.dto.response.MessageResponse;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.ViolationDTO;
import com.imdb.service.IAdminViolationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/violations")
@RequiredArgsConstructor
public class AdminViolationController {

    private final IAdminViolationService violationService;

    @GetMapping
    public ResponseEntity<PagedResponse<ViolationDTO>> getViolations(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String status
    ) {
        return ResponseEntity.ok(violationService.getViolations(page, size, status));
    }

    @PatchMapping("/{id}/ignore")
    public ResponseEntity<MessageResponse> ignore(
            @PathVariable Long id,
            @RequestBody(required = false) ViolationActionRequest request
    ) {
        violationService.ignore(id, request != null ? request : new ViolationActionRequest(null));
        return ResponseEntity.ok(new MessageResponse("Đã bỏ qua báo cáo"));
    }

    @PatchMapping("/{id}/remove-content")
    public ResponseEntity<MessageResponse> removeContent(
            @PathVariable Long id,
            @RequestBody(required = false) ViolationActionRequest request
    ) {
        violationService.removeContent(id, request != null ? request : new ViolationActionRequest(null));
        return ResponseEntity.ok(new MessageResponse("Đã xoá nội dung vi phạm"));
    }

    @PatchMapping("/{id}/warn-user")
    public ResponseEntity<MessageResponse> warnUser(
            @PathVariable Long id,
            @RequestBody(required = false) ViolationActionRequest request
    ) {
        violationService.warnUser(id, request != null ? request : new ViolationActionRequest(null));
        return ResponseEntity.ok(new MessageResponse("Đã cảnh cáo người dùng"));
    }

    @PatchMapping("/{id}/ban-user")
    public ResponseEntity<MessageResponse> banUser(
            @PathVariable Long id,
            @RequestBody(required = false) ViolationActionRequest request
    ) {
        violationService.banUser(id, request != null ? request : new ViolationActionRequest(null));
        return ResponseEntity.ok(new MessageResponse("Đã khoá tài khoản người dùng"));
    }
}