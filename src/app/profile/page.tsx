'use client';
import { Card, Avatar, Typography, Descriptions, Tabs, List, Button } from 'antd';
import { UserOutlined, EditOutlined, BookOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const enrolledCourses = []; // Placeholder for user courses

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <div className="flex items-center gap-6">
            <Avatar size={100} icon={<UserOutlined />} />
            <div className="flex-1">
              <Title level={2} className="mb-2">{user.hoTen}</Title>
              <Text type="secondary" className="text-lg">@{user.taiKhoan}</Text>
              <div className="mt-4">
                <Button type="primary" icon={<EditOutlined />}>
                  Chỉnh sửa thông tin
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultActiveKey="info">
          <TabPane tab="Thông tin cá nhân" key="info">
            <Card>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tài khoản">
                  {user.taiKhoan}
                </Descriptions.Item>
                <Descriptions.Item label="Họ tên">
                  {user.hoTen}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {user.soDT}
                </Descriptions.Item>
                <Descriptions.Item label="Loại người dùng">
                  {user.maLoaiNguoiDung === 'HV' ? 'Học viên' : 'Giảng viên'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </TabPane>

          <TabPane tab="Khóa học đã đăng ký" key="courses">
            <Card>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOutlined className="text-4xl text-gray-400 mb-4" />
                  <Title level={4} type="secondary">
                    Chưa có khóa học nào
                  </Title>
                  <Text type="secondary">
                    Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học thú vị!
                  </Text>
                  <div className="mt-4">
                    <Button type="primary" onClick={() => router.push('/')}>
                      Khám phá khóa học
                    </Button>
                  </div>
                </div>
              ) : (
                <List
                  dataSource={enrolledCourses}
                  renderItem={(course: any) => (
                    <List.Item>
                      <List.Item.Meta
                        title={course.tenKhoaHoc}
                        description={course.moTa}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}