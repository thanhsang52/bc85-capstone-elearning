import axios from 'axios';

const BASE_URL = 'https://elearningnew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'TokenCybersoft': TOKEN_CYBERSOFT,
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  taiKhoan: string;
  matKhau: string;
}

export interface RegisterRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
}

export interface Course {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  soLuongHocVien: number;
  nguoiTao: {
    taiKhoan: string;
    hoTen: string;
    maLoaiNguoiDung: string;
    tenLoaiNguoiDung: string;
  };
  danhMucKhoaHoc: {
    maDanhMucKhoahoc: string;
    tenDanhMucKhoaHoc: string;
  };
}

export interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maLoaiNguoiDung: string;
  accessToken: string;
}

export const elearningService = {
  // Auth APIs
  login: (data: LoginRequest) => api.post<User>('/QuanLyNguoiDung/DangNhap', data),
  
  register: (data: RegisterRequest) => api.post('/QuanLyNguoiDung/DangKy', data),
  
  // Course APIs
  getCourseList: () => api.get<Course[]>('/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01'),
  
  getCourseByCategory: (maDanhMuc: string) => 
    api.get<Course[]>(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=GP01`),
  
  getCourseDetail: (maKhoaHoc: string) => 
    api.get<Course>(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${maKhoaHoc}`),
  
  // Category APIs
  getCategoryList: () => api.get('/QuanLyKhoaHoc/LayDanhMucKhoaHoc'),
  
  // User course APIs
  registerCourse: (data: { maKhoaHoc: string; taiKhoan: string }) => 
    api.post('/QuanLyKhoaHoc/DangKyKhoaHoc', data),
  
  getUserCourses: (taiKhoan: string) => 
    api.post('/QuanLyNguoiDung/LayThongTinNguoiDung', { taiKhoan }),
  
  getRegisteredCourses: (taiKhoan: string) => 
    api.post('/QuanLyNguoiDung/LayThongTinNguoiDung', { taiKhoan }),
  
  // Admin APIs
  getUserList: () => api.get('/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01'),
  
  deleteUser: (taiKhoan: string) => 
    api.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`),
  
  updateUser: (data: any) => 
    api.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', data),
  
  getCourseStudents: (maKhoaHoc: string) => 
    api.post('/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc', { maKhoaHoc }),
  
  getPendingStudents: (maKhoaHoc: string) => 
    api.post('/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet', { maKhoaHoc }),
  
  approveStudent: (data: { maKhoaHoc: string; taiKhoan: string }) => 
    api.post('/QuanLyKhoaHoc/GhiDanhKhoaHoc', data),
  
  rejectStudent: (data: { maKhoaHoc: string; taiKhoan: string }) => 
    api.post('/QuanLyKhoaHoc/HuyGhiDanh', data),
  
  getUserPendingCourses: (taiKhoan: string) => 
    api.post('/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet', { taiKhoan }),
  
  getUserApprovedCourses: (taiKhoan: string) => 
    api.post('/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet', { taiKhoan })
};