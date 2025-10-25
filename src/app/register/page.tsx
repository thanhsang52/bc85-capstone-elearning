'use client';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { elearningService, RegisterRequest } from '../../services/elearningService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

interface FormValues {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  matKhau: string;
  confirmPassword: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function RegisterPage() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => elearningService.register(data),
    onSuccess: () => {
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/login');
    },
    onError: (error: ApiError) => {
      message.error(error.response?.data?.message || 'Đăng ký thất bại!');
    }
  });

  const onFinish = (values: FormValues) => {
    const registerData: RegisterRequest = {
      ...values,
      maNhom: 'GP01'
    };
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>Đăng Ký</Title>
          <p className="text-gray-600">Tạo tài khoản mới để bắt đầu học!</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="taiKhoan"
            label="Tài khoản"
            rules={[
              { required: true, message: 'Vui lòng nhập tài khoản!' },
              { min: 3, message: 'Tài khoản phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tài khoản"
            />
          </Form.Item>

          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập họ tên"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email"
            />
          </Form.Item>

          <Form.Item
            name="soDT"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['matKhau']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('matKhau') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={registerMutation.isPending}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Đăng nhập ngay
          </Link>
        </div>
      </Card>
    </div>
  );
}