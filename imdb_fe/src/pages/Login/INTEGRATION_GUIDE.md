# Login Integration Guide

## 📋 Architecture Overview

Trang login đã được thiết kế để dễ dàng ghép nối với Spring Boot backend. Dưới đây là các bước cần thiết.

## 🔧 Backend Configuration (Spring Boot)

### 1. Create Auth Controller

Tạo một controller trong Spring Boot để handle login requests:

```java
// AuthController.java
package com.imdb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.imdb.dto.LoginRequest;
import com.imdb.dto.LoginResponse;
import com.imdb.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Frontend URL
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }
}
```

### 2. Create DTOs

```java
// LoginRequest.java
package com.imdb.dto;

public class LoginRequest {
    private String email;
    private String password;

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// LoginResponse.java
package com.imdb.dto;

public class LoginResponse {
    private String token;
    private User user;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}

// User DTO
public class User {
    private String id;
    private String email;
    private String name;

    // Getters and setters
}
```

### 3. Create Auth Service

```java
// AuthService.java
package com.imdb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.imdb.dto.LoginRequest;
import com.imdb.dto.LoginResponse;
import com.imdb.entity.User;
import com.imdb.repository.UserRepository;
import com.imdb.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user.getId());

        return new LoginResponse(
            token,
            new User(user.getId(), user.getEmail(), user.getName())
        );
    }

    public LoginResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId());

        return new LoginResponse(
            token,
            new User(user.getId(), user.getEmail(), user.getName())
        );
    }
}
```

## 🚀 Frontend Configuration

### 1. Environment Variables

Tạo file `.env.local` trong thư mục `imdb_fe`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Hoặc nếu deploy trên production:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 2. Update API Configuration

Tập tin `src/api/auth.ts` đã hỗ trợ sẵn:

- Tự động thêm token vào header mỗi request
- Xử lý error response
- Lưu token và user info vào localStorage

### 3. Using Auth State in Components

Sử dụng `useAuthStore` hook trong các components:

```tsx
import { useAuthStore } from "./store/authStore";

const MyComponent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 📝 Login Flow

1. **User enters email & password** → Form validation on frontend
2. **Submit to `/api/auth/login`** → POST request with credentials
3. **Backend verifies** → Checks database, validates password
4. **Returns JWT token** → Frontend stores token in localStorage
5. **Auth state updated** → User can access protected pages
6. **Token sent with requests** → Automatic header injection via axios interceptor

## 🔐 Security Best Practices

1. **Use HTTPS** - Always encrypt credentials in transit
2. **JWT Validation** - Validate token signature on backend
3. **Token Refresh** - Implement refresh token mechanism (optional)
4. **Password Hashing** - Use bcrypt or similar on backend
5. **CORS Configuration** - Restrict to your frontend domain

## 🧪 Testing Login

### Development Server

```bash
# Terminal 1: Start frontend
cd imdb_fe
npm run dev

# Terminal 2: Start backend (Spring Boot)
mvn spring-boot:run
```

### Test Credentials

Use your test credentials created in database.

## 🔄 Social Login Integration

The login page has placeholders for Facebook and Google login. To implement:

1. **Facebook Login**
   - Install: `npm install react-facebook-login`
   - Get Facebook App ID from [Facebook Developer](https://developers.facebook.com)
   - Update `handleSocialLogin` in Login component

2. **Google Login**
   - Install: `npm install @react-oauth/google`
   - Get Google Client ID from [Google Cloud Console](https://console.cloud.google.com)
   - Update `handleSocialLogin` in Login component

## 📱 API Endpoints Required

Your Spring Boot backend should provide these endpoints:

| Method | Endpoint            | Purpose           |
| ------ | ------------------- | ----------------- |
| POST   | `/api/auth/login`   | User login        |
| POST   | `/api/auth/signup`  | User registration |
| POST   | `/api/auth/logout`  | User logout       |
| GET    | `/api/auth/me`      | Get current user  |
| POST   | `/api/auth/refresh` | Refresh token     |

## 🎯 Response Format

Expected response format from backend:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## ❌ Error Handling

The login component automatically handles:

- Invalid email format
- Missing credentials
- Backend error responses
- Network errors

Errors are displayed under respective input fields.

## 🔗 Next Steps

1. Implement backend endpoints as described above
2. Update `REACT_APP_API_URL` in `.env.local`
3. Test login functionality
4. Implement protected routes if needed
5. Add logout functionality to Navbar

---

**Made for easy Spring Boot integration!** 🎉
