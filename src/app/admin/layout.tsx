'use client';
import { Layout, Menu, Avatar, Dropdown, Typography, App } from 'antd';
import { DashboardOutlined, BookOutlined, UserOutlined, LogoutOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/userSlice';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const userMenu = {
    items: [
      // {
      //   key: 'settings',
      //   icon: <SettingOutlined />,
      //   label: 'Cài đặt',
      // },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/courses',
      icon: <BookOutlined />,
      label: <Link href="/admin/courses">Quản lý khóa học</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: '/admin/pending-students',
      icon: <ClockCircleOutlined />,
      label: <Link href="/admin/pending-students">Học viên chờ duyệt</Link>,
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div className="p-4 text-center border-b border-gray-700">
          <Title level={4} className="!text-white !mb-0">
            🎓 Admin Panel
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={pathname ? [pathname] : []}
          items={menuItems}
          className="border-none"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white shadow-sm px-6 flex justify-between items-center">
          <Title level={3} className="!mb-0 !text-gray-800">
            Quản trị hệ thống
          </Title>
          
          <Dropdown menu={userMenu} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50">
              <Avatar icon={<UserOutlined />} className="bg-blue-600" />
              <div>
                <div className="font-medium text-gray-700">{user?.hoTen}</div>
                <div className="text-xs text-gray-500">Quản trị viên</div>
              </div>
            </div>
          </Dropdown>
        </Header>
        
        <Content className="p-6 bg-gray-50">
          <App>
            {children}
          </App>
        </Content>
      </Layout>
    </Layout>
  );
}