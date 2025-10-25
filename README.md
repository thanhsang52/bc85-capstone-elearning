# E-Learning Platform

Dự án khóa học online được xây dựng với Next.js, TypeScript, Redux Toolkit và Ant Design.

## Tính năng

- 🏠 Trang chủ với danh sách khóa học nổi bật
- 🔐 Đăng nhập/Đăng ký người dùng
- 📚 Xem danh sách khóa học
- 👤 Quản lý thông tin cá nhân
- 📱 Responsive design

## Công nghệ sử dụng

- **Frontend**: Next.js 15, TypeScript, React 19
- **State Management**: Redux Toolkit
- **UI Library**: Ant Design
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Query

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy development server:

```bash
npm run dev
```

3. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## API

Dự án sử dụng API từ: https://elearningnew.cybersoft.edu.vn/swagger/index.html

## Cấu trúc thư mục

```
src/
├── app/                 # Next.js App Router
│   ├── login/          # Trang đăng nhập
│   ├── register/       # Trang đăng ký
│   └── page.tsx        # Trang chủ
├── components/         # React components
│   ├── Header/         # Header navigation
│   └── Cart/           # Khóa học đã đăng ký
├── services/           # API services
├── store/              # Redux store
└── assets/             # Static assets
```

## Tài khoản test học viên

- Tài khoản: `thanhsang52`
- Mật khẩu: `123456`

## Tài khoản test quản trị

- Tài khoản: `admin@`
- Mật khẩu: `Admin123`
