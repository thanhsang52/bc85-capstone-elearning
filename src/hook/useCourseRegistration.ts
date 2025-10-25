'use client';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { RootState } from '../store';
import { elearningService } from '../services/elearningService';

export const useCourseRegistration = (maKhoaHoc?: string) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);

  // Sử dụng localStorage để theo dõi khóa học đã đăng ký
  const getRegisteredCourses = () => {
    if (typeof window === 'undefined' || !user?.taiKhoan) return [];
    const stored = localStorage.getItem(`registeredCourses_${user.taiKhoan}`);
    return stored ? JSON.parse(stored) : [];
  };

  const isRegistered = maKhoaHoc && getRegisteredCourses().includes(maKhoaHoc);

  const registerMutation = useMutation({
    mutationFn: (maKhoaHoc: string) => 
      elearningService.registerCourse({ 
        maKhoaHoc, 
        taiKhoan: user!.taiKhoan 
      }),
    onSuccess: () => {
      // Lưu vào localStorage
      if (user?.taiKhoan) {
        const registered = getRegisteredCourses();
        const updated = [...registered, maKhoaHoc];
        localStorage.setItem(`registeredCourses_${user.taiKhoan}`, JSON.stringify(updated));
      }
      message.success('Đăng ký khóa học thành công!');
    },
    onError: () => {
      message.error('Đăng ký khóa học thất bại!');
    }
  });

  const handleRegisterCourse = (maKhoaHoc: string) => {
    if (!isAuthenticated) {
      // Lưu URL hiện tại để redirect sau khi đăng nhập
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentUrl);
      router.push('/login');
      return;
    }

    registerMutation.mutate(maKhoaHoc);
  };

  return {
    handleRegisterCourse,
    isLoading: registerMutation.isPending,
    isRegistered: !!isRegistered
  };
};