# Demo Credentials - Fake Data for Testing

## Fake User Accounts

Sử dụng các tài khoản dưới để test login feature:

### Account 1 - Demo User

- **Email:** `demo@example.com`
- **Password:** `demo123`
- **Name:** Demo User

### Account 2 - Admin User

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Name:** Admin User

### Account 3 - John Doe

- **Email:** `john@example.com`
- **Password:** `john123`
- **Name:** John Doe

## Cách Sử Dụng

1. Để bật Mock API, mở file `src/api/auth.ts`
2. Tìm dòng: `const ENABLE_MOCK_API = true;`
   - Nếu `true`: Mock API sẽ xử lý login/signup request
   - Nếu `false`: Sẽ gửi request tới backend thực sự

3. Vào trang Login và nhập email + password từ list trên

## Cách Mở Rộng Fake Data

Muốn thêm user mới? Edit mảng `FAKE_USERS` trong `src/api/auth.ts`:

```typescript
const FAKE_USERS = [
  {
    id: "1",
    email: "your-email@example.com",
    password: "your-password",
    name: "Your Name",
  },
  // ... thêm user khác
];
```

## Notes

- Token được tạo giả là: `fake_token_{userId}_{timestamp}`
- Có delay 500ms để simulate network request
- Login fail sẽ trả lại error: "Email hoặc mật khẩu không chính xác"
- SignUp sẽ tự động tạo user mới với mật khẩu default: `password123`
