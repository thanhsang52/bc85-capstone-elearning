'use client';
import { Layout, Menu, Button, Avatar, Dropdown, Input } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined, BellOutlined, ShoppingCartOutlined, PhoneOutlined, BookOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout, loadUserFromStorage } from '../../store/userSlice';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { elearningService } from '../../services/elearningService';
import Link from 'next/link';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);

  // Fetch categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => elearningService.getCategoryList().then(res => res.data)
  });

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link href="/profile">Thông tin cá nhân</Link>,
      },
      ...(user?.maLoaiNguoiDung === 'HV' ? [{
        key: 'my-courses',
        icon: <BookOutlined />,
        label: <Link href="/my-courses">Khóa học của tôi</Link>,
      }] : []),
      
      ...(user?.maLoaiNguoiDung === 'GV' ? [{
        key: 'admin',
        icon: <SettingOutlined />,
        label: <Link href="/admin">Quản trị</Link>,
      }] : []),
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg w-full rounded-t-lg sticky-header">
      {/* Main header */}
      <AntHeader className="bg-white h-auto border-b border-gray-100  px-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="https://elearning.iigvietnam.com/images/logo.png" 
                alt="Logo" 
                className="h-12 w-auto"
                style={{ padding: '5px 0' }}
              />
            </Link>

            {/* Search */}
            <div className="max-w-sm mx-4">
              <Search
                placeholder="Tìm kiếm..."
               
                className="w-full"
                enterButton={
                  <Button type="primary" className="bg-blue-600 border-blue-600">
                    <SearchOutlined />
                  </Button>
                }
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Hotline */}
              <div className="hidden md:flex items-center gap-2 text-blue-600">
                <PhoneOutlined className="text-lg" />
                <span className="font-semibold">1900636929</span>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    className="text-gray-600 hover:text-blue-600"
                    size="large"
                  />
                  
                  <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                    <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar 
                        icon={<UserOutlined />} 
                        className="bg-blue-600"
                        size="default"
                      />
                      <div className="hidden lg:block">
                        <div className="font-medium text-gray-700 text-sm">{user?.hoTen}</div>
                        <div className="text-xs text-gray-500">{user?.maLoaiNguoiDung}</div>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button 
                      type="default" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  &nbsp;
                  <Link href="/register">
                    <Button 
                      type="primary" 
                      className="bg-blue-600 border-blue-600 hover:bg-blue-700"
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </AntHeader>
      
      {/* Navigation Menu */}
      <div className="bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4">
          <Menu 
            mode="horizontal" 
            className="border-none bg-transparent justify-center"
            style={{ fontSize: '15px', fontWeight: '500' }}
            items={[
              {
                key: 'home',
                label: <Link href="/" className="text-gray-700 hover:text-blue-600 px-4 py-3">Trang chủ</Link>
              },
              {
                key: 'courses',
                label: <Link href="/courses" className="text-gray-700 hover:text-blue-600 px-4 py-3">Khóa học</Link>
              },
              {
                key: 'categories',
                label: <span className="text-gray-700 hover:text-blue-600 px-4 py-3">Danh mục</span>,
                children: categories?.map((category: any) => ({
                  key: category.maDanhMuc,
                  label: (
                    <Link 
                      href={`/courses?category=${category.maDanhMuc}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {category.tenDanhMuc}
                    </Link>
                  )
                })) || []
              },

              {
                key: 'about',
                label: <Link href="/about" className="text-gray-700 hover:text-blue-600 px-4 py-3">Về chúng tôi</Link>
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;