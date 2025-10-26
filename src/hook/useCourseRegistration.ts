'use client';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { RootState } from '../store';
import { elearningService } from '../services/elearningService';
import React from 'react';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useCourseRegistration = (maKhoaHoc?: string) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);
  const { message, modal } = App.useApp();

  // Sử dụng localStorage để theo dõi khóa học đã đăng ký
  const getRegisteredCourses = () => {
    if (typeof window === 'undefined' || !user?.taiKhoan) return [];
    const stored = localStorage.getItem(`registeredCourses_${user.taiKhoan}`);
    return stored ? JSON.parse(stored) : [];
  };

  const isRegistered = maKhoaHoc && getRegisteredCourses().includes(maKhoaHoc);

  const registerMutation = useMutation({
    mutationFn: (courseId: string) => 
      elearningService.registerCourse({ 
        maKhoaHoc: courseId, 
        taiKhoan: user!.taiKhoan 
      }),
    onSuccess: (_: unknown, courseId: string) => {
      console.log('Registration successful for course:', courseId);
      
      // Lưu vào localStorage
      if (user?.taiKhoan) {
        const registered = getRegisteredCourses();
        const updated = [...registered, courseId];
        localStorage.setItem(`registeredCourses_${user.taiKhoan}`, JSON.stringify(updated));
      }
      
      // Hiển thị message
      message.success('Đăng ký khóa học thành công!');
      
      // Hiển thị modal
      modal.success({
        title: 'Đăng ký thành công!',
        content: 'Bạn đã đăng ký khóa học thành công. Hãy bắt đầu học ngay!',
        okText: 'Bắt đầu học',
        onOk: () => {
          router.push(`/learning/${courseId}`);
        }
      });
    },
    onError: (error: ApiError) => {
      console.log('Registration failed:', error);
      
      // Hiển thị message
      message.error('Đăng ký khóa học thất bại!');
      
      // Hiển thị modal
      modal.error({
        title: 'Đăng ký thất bại!',
        content: error?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký khóa học. Vui lòng thử lại!',
        okText: 'Thử lại'
      });
    }
  });

  const handleRegisterCourse = (maKhoaHoc: string) => {
    console.log('Attempting to register for course:', maKhoaHoc);
    console.log('User authenticated:', isAuthenticated);
    console.log('User info:', user);
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      // Lưu URL hiện tại để redirect sau khi đăng nhập
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentUrl);
      router.push('/login');
      return;
    }

    console.log('Starting mutation...');
    registerMutation.mutate(maKhoaHoc);
  };

  return {
    handleRegisterCourse,
    isLoading: registerMutation.isPending,
    isRegistered: !!isRegistered
  };
};