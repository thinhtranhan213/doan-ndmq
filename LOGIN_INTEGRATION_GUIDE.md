# Login Integration Guide - Frontend & Backend

## Tổng Quan

Hệ thống login đã được ghép nối hoàn chỉnh giữa backend (Spring Boot) và frontend (React) với hỗ trợ:

- ✅ Login thông thường (Email/Password)
- ✅ Google OAuth2 Login
- ✅ JWT Token Authentication
- ✅ Liên kết User từ cơ sở dữ liệu

## Luồng Hoạt Động

### 1. Login Thông Thường (Email/Password)

```
Frontend (Login Form)
    ↓
POST /api/auth/login (email, password)
    ↓
Backend (AuthController)
    ↓
Authenticate & Generate JWT Token
    ↓
Return LoginResponse (token, userName, email, roles)
    ↓
Frontend: Lưu token vào localStorage
    ↓
Redirect tới Home Page
```

### 2. Google OAuth2 Login

```
Frontend (Click "Login with Google")
    ↓
Redirect tới: http://localhost:8080/oauth2/authorization/google
    ↓
Google Login Page
    ↓
User nhập credentials
    ↓
Backend (OAuth2LoginSuccessHandler)
    ↓
Kiểm tra email trong database
    ↓
Nếu không tồn tại → Tạo user mới với role USER
    ↓
Generate JWT Token
    ↓
Redirect tới: http://localhost:3000/login-success?token=XXX&user=YYY
    ↓
Frontend (LoginSuccess Component)
    ↓
Parse token & user info
    ↓
Lưu vào localStorage & Zustand store
    ↓
Redirect tới Home Page
```

## Files Được Cập Nhật

### Frontend

1. **`src/api/auth.ts`**
   - Thêm `OAUTH2_GOOGLE_URL` constant
   - Thêm `loginWithGoogle()` function
   - Thêm `handleOAuth2Callback()` function
   - Tắt Mock API (set `ENABLE_MOCK_API = false`)

2. **`src/pages/Login/Login.tsx`**
   - Import `loginWithGoogle` từ auth.ts
   - Cập nhật `handleSocialLogin()` để xử lý Google login

3. **`src/pages/LoginSuccess/LoginSuccess.tsx`** (NEW)
   - Component xử lý OAuth2 callback
   - Parse token & user info từ URL
   - Redirect tới home page

4. **`src/App.tsx`**
   - Import `LoginSuccess` component
   - Thêm route `/login-success`
   - Update `isAuthPage` check

### Backend

1. **`src/main/java/com/imdb/config/oauth2/OAuth2LoginSuccessHandler.java`**
   - Cập nhật để gửi user info trong redirect URL
   - Encode user info (id|email|name) khi redirect

2. **`src/main/java/com/imdb/controller/UserController.java`**
   - Cập nhật `/api/user/me` endpoint
   - Trả user info dưới dạng JSON (LoginResponse)

## Cách Sử Dụng

### Login thông thường

1. Truy cập trang `/login`
2. Nhập email và password
3. Nhấn "Log in"
4. Nếu thành công → Redirect tới home page
5. Token được lưu vào localStorage

### Google OAuth2 Login

1. Truy cập trang `/login`
2. Nhấn nút "Log in with Google"
3. Redirect tới Google login page
4. Nhập credentials Google
5. Backend tạo/cập nhật user trong database
6. Redirect tới `/login-success?token=...&user=...`
7. Frontend xử lý callback → Lưu token → Redirect tới home

## Configuration Backend

File: `src/main/resources/application.yaml`

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET
            scope:
              - profile
              - email
```

**Lấy Google OAuth2 Credentials:**

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo OAuth2 Web Application
3. Thêm authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`

## Lỗi Common & Giải pháp

### 1. "Không tìm thấy token"

- Kiểm tra backend có chạy tại `http://localhost:8080` không
- Kiểm tra Google OAuth2 credentials có đúng không

### 2. "localStorage is not defined"

- Vấn đề: Code chạy ở server-side (SSR)
- Giải pháp: Wrap localStorage calls trong `typeof window !== 'undefined'` check

### 3. CORS Error

- Kiểm tra `CorsConfig.java` trên backend
- Frontend URL phải được thêm vào allowed origins

### 4. Token expired

- Frontend sẽ cần implement token refresh logic
- Kiểm tra `Axios` interceptor xử lý 401 responses

## Thông Tin User

Sau khi login thành công, user info được lưu trong:

- `localStorage` (persist across browser refresh)
- `Zustand authStore` (React state management)

Cấu trúc User:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}
```

Lấy user info:

```typescript
import { useAuthStore } from './store/authStore';

const MyComponent = () => {
    const user = useAuthStore((state) => state.user);
    return <div>Hello {user?.name}!</div>;
};
```

## Next Steps

1. ✅ Test login thông thường
2. ✅ Test Google OAuth2 login
3. ⚠️ Implement token refresh (khi token expires)
4. ⚠️ Implement logout
5. ⚠️ Protect routes dựa trên authentication status
6. ⚠️ Implement Facebook OAuth2 (tương tự Google)

## Endpoints Available

### Auth Endpoints

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot-password` - Request password reset
- `GET /oauth2/authorization/google` - Initiate Google OAuth2 login

### User Endpoints

- `GET /api/user/me` - Get current user info (requires JWT token)
- `PUT /api/user/change-password` - Change password (requires JWT token)

## Debugging

### Enable detailed logging

Thêm vào `application.yaml`:

```yaml
logging:
  level:
    org.springframework.security: DEBUG
    com.imdb.config: DEBUG
```

### Check token content

```typescript
// Frontend
const token = localStorage.getItem("authToken");
console.log(token); // JWT token

// Decode JWT (install: npm install jwt-decode)
import jwtDecode from "jwt-decode";
const decoded = jwtDecode(token);
console.log(decoded);
```

---

**Ngày cập nhật:** 12/03/2026
**Author:** GitHub Copilot
