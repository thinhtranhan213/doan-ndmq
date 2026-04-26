package com.imdb.controller;

import com.imdb.dto.request.UserRoleRequest;
import com.imdb.dto.request.UserStatusRequest;
import com.imdb.dto.response.MessageResponse;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.UserAdminDTO;
import com.imdb.service.IAdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminUserService adminUserService;

    // -------- User Management --------

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserAdminDTO>> getUsers(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String status,
            @RequestParam(required = false)    String role,
            @RequestParam(required = false)    String search
    ) {
        return ResponseEntity.ok(adminUserService.getUsers(page, size, status, role, search));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserAdminDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<MessageResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UserStatusRequest request
    ) {
        adminUserService.updateUserStatus(id, request);
        return ResponseEntity.ok(new MessageResponse("Cập nhật trạng thái thành công"));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<MessageResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody UserRoleRequest request
    ) {
        adminUserService.updateUserRole(id, request);
        return ResponseEntity.ok(new MessageResponse("Cập nhật vai trò thành công"));
    }

}