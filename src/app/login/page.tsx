'use client';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { elearningService, LoginRequest } from '../../services/elearningService';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => elearningService.login(data),
    onSuccess: (response) => {
      dispatch(loginSuccess(response.data));
      message.success('Đăng nhập thành công!');
      
      // Redirect về trang trước đó nếu có
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  });

  const onFinish = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>Đăng Nhập</Title>
          <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="taiKhoan"
            label="Tài khoản"
            rules={[
              { required: true, message: 'Vui lòng nhập tài khoản!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tài khoản"
            />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loginMutation.isPending}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            Đăng ký ngay
          </Link>
        </div>
      </Card>
    </div>
  );
}