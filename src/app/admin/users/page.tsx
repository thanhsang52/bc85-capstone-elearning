'use client';
import { useState } from 'react';
import { Table, Button, Input, Space, Tag, Typography, Card, Modal, Form, Select, message, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { elearningService } from '../../../services/elearningService';

const { Title } = Typography;
const { Search } = Input;

export default function AdminUsersPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPendingCoursesModalOpen, setIsPendingCoursesModalOpen] = useState(false);
  const [isApprovedCoursesModalOpen, setIsApprovedCoursesModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserForApproved, setSelectedUserForApproved] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => elearningService.getUserList().then(res => res.data)
  });

  const { data: userPendingCourses, isLoading: pendingCoursesLoading } = useQuery({
    queryKey: ['userPendingCourses', selectedUser?.taiKhoan],
    queryFn: () => elearningService.getUserPendingCourses(selectedUser!.taiKhoan).then(res => res.data),
    enabled: !!selectedUser
  });

  const { data: userApprovedCourses, isLoading: approvedCoursesLoading } = useQuery({
    queryKey: ['userApprovedCourses', selectedUserForApproved?.taiKhoan],
    queryFn: () => elearningService.getUserApprovedCourses(selectedUserForApproved!.taiKhoan).then(res => res.data),
    enabled: !!selectedUserForApproved
  });

  const deleteMutation = useMutation({
    mutationFn: (taiKhoan: string) => elearningService.deleteUser(taiKhoan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Xóa người dùng thành công!');
    },
    onError: () => {
      message.error('Xóa người dùng thất bại!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => elearningService.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Cập nhật người dùng thành công!');
      handleModalClose();
    },
    onError: () => {
      message.error('Cập nhật người dùng thất bại!');
    }
  });

  const approveMutation = useMutation({
    mutationFn: (data: { maKhoaHoc: string; taiKhoan: string }) => 
      elearningService.approveStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPendingCourses', selectedUser?.taiKhoan] });
      message.success('Duyệt khóa học thành công!');
    },
    onError: () => {
      message.error('Duyệt khóa học thất bại!');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { maKhoaHoc: string; taiKhoan: string }) => 
      elearningService.rejectStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userApprovedCourses', selectedUserForApproved?.taiKhoan] });
      message.success('Hủy ghi danh khóa học thành công!');
    },
    onError: () => {
      message.error('Hủy ghi danh khóa học thất bại!');
    }
  });

  const filteredUsers = users?.filter((user: any) =>
    user.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.taiKhoan.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const handleEdit = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleViewPendingCourses = (user: any) => {
    setSelectedUser(user);
    setIsPendingCoursesModalOpen(true);
  };

  const handlePendingCoursesModalClose = () => {
    setIsPendingCoursesModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewApprovedCourses = (user: any) => {
    setSelectedUserForApproved(user);
    setIsApprovedCoursesModalOpen(true);
  };

  const handleApprovedCoursesModalClose = () => {
    setIsApprovedCoursesModalOpen(false);
    setSelectedUserForApproved(null);
  };

  const handleApproveCourse = (maKhoaHoc: string) => {
    if (selectedUser) {
      approveMutation.mutate({
        maKhoaHoc,
        taiKhoan: selectedUser.taiKhoan
      });
    }
  };

  const handleRejectApprovedCourse = (maKhoaHoc: string) => {
    if (selectedUserForApproved) {
      rejectMutation.mutate({
        maKhoaHoc,
        taiKhoan: selectedUserForApproved.taiKhoan
      });
    }
  };

  const handleSubmit = (values: any) => {
    if (editingUser) {
      updateMutation.mutate({
        ...values,
        maNhom: 'GP01'
      });
    } else {
      message.info('Tính năng thêm người dùng sẽ được phát triển');
    }
  };

  const handleDelete = (taiKhoan: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      onOk: () => {
        deleteMutation.mutate(taiKhoan);
      }
    });
  };

  const columns = [
    {
      title: 'Avatar',
      key: 'avatar',
      width: 80,
      render: (_, record: any) => (
        <Avatar icon={<UserOutlined />} className="bg-blue-600" />
      ),
    },
    {
      title: 'Tài khoản',
      dataIndex: 'taiKhoan',
      key: 'taiKhoan',
      width: 120,
      render: (text: string) => <div className="font-medium">{text}</div>,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 180,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDt',
      key: 'soDt',
      width: 130,
    },
    {
      title: 'Loại người dùng',
      dataIndex: 'maLoaiNguoiDung',
      key: 'maLoaiNguoiDung',
      width: 130,
      render: (text: string, record: any) => (
        <Tag color={record.maLoaiNguoiDung === 'GV' ? 'green' : 'blue'}>
          {text}
        </Tag>
      ),
    },

    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: any) => (
        <Space>
          {record.maLoaiNguoiDung === 'HV' && (
            <>
              <Button
                type="text"
                icon={<ClockCircleOutlined />}
                onClick={() => handleViewPendingCourses(record)}
                title="Xem khóa học chờ duyệt"
              />
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleViewApprovedCourses(record)}
                title="Xem khóa học đã duyệt"
              />
            </>
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.taiKhoan)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">Quản lý người dùng</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-blue-600"
        >
          Thêm người dùng
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm người dùng..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="taiKhoan"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} người dùng`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="taiKhoan"
            label="Tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input placeholder="Nhập tài khoản" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="soDt"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="maLoaiNguoiDung"
            label="Loại người dùng"
            rules={[{ required: true, message: 'Vui lòng chọn loại người dùng!' }]}
          >
            <Select placeholder="Chọn loại người dùng">
              <Select.Option value="HV">Học viên</Select.Option>
              <Select.Option value="GV">Giáo viên</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleModalClose}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateMutation.isPending}
              className="bg-blue-600"
            >
              {editingUser ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={`Khóa học chờ xét duyệt - ${selectedUser?.hoTen}`}
        open={isPendingCoursesModalOpen}
        onCancel={handlePendingCoursesModalClose}
        footer={null}
        width={800}
      >
        <Table
          columns={[
            {
              title: 'Mã khóa học',
              dataIndex: 'maKhoaHoc',
              key: 'maKhoaHoc',
            },
            {
              title: 'Tên khóa học',
              dataIndex: 'tenKhoaHoc',
              key: 'tenKhoaHoc',
            },
            {
              title: 'Danh mục',
              dataIndex: ['danhMucKhoaHoc', 'tenDanhMucKhoaHoc'],
              key: 'danhMuc',
              render: (text: string) => <Tag color="blue">{text}</Tag>,
            },
            {
              title: 'Trạng thái',
              key: 'status',
              render: () => (
                <Tag color="orange">Chờ xét duyệt</Tag>
              ),
            },
            {
              title: 'Thao tác',
              key: 'actions',
              render: (_, record: any) => (
                <Button
                  type="primary"
                  size="small"
                  loading={approveMutation.isPending}
                  onClick={() => handleApproveCourse(record.maKhoaHoc)}
                  className="bg-green-600 border-green-600"
                >
                  Duyệt
                </Button>
              ),
            },
          ]}
          dataSource={userPendingCourses}
          rowKey="maKhoaHoc"
          loading={pendingCoursesLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} khóa học`,
          }}
        />
      </Modal>

      <Modal
        title={`Khóa học đã xét duyệt - ${selectedUserForApproved?.hoTen}`}
        open={isApprovedCoursesModalOpen}
        onCancel={handleApprovedCoursesModalClose}
        footer={null}
        width={800}
      >
        <Table
          columns={[
            {
              title: 'Mã khóa học',
              dataIndex: 'maKhoaHoc',
              key: 'maKhoaHoc',
            },
            {
              title: 'Tên khóa học',
              dataIndex: 'tenKhoaHoc',
              key: 'tenKhoaHoc',
            },
            {
              title: 'Danh mục',
              dataIndex: ['danhMucKhoaHoc', 'tenDanhMucKhoaHoc'],
              key: 'danhMuc',
              render: (text: string) => <Tag color="blue">{text}</Tag>,
            },
            {
              title: 'Trạng thái',
              key: 'status',
              render: () => (
                <Tag color="green">Đã xét duyệt</Tag>
              ),
            },
            {
              title: 'Thao tác',
              key: 'actions',
              render: (_, record: any) => (
                <Button
                  danger
                  size="small"
                  loading={rejectMutation.isPending}
                  onClick={() => handleRejectApprovedCourse(record.maKhoaHoc)}
                >
                  Hủy ghi danh
                </Button>
              ),
            },
          ]}
          dataSource={userApprovedCourses}
          rowKey="maKhoaHoc"
          loading={approvedCoursesLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} khóa học`,
          }}
        />
      </Modal>
    </div>
  );
}