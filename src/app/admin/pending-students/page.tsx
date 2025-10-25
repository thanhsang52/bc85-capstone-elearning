'use client';
import { useState } from 'react';
import { Table, Button, Input, Space, Typography, Card, Select, Avatar, Tag } from 'antd';
import { SearchOutlined, UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { elearningService, Course } from '../../../services/elearningService';
import { message } from 'antd';

interface PendingStudent {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
}

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function PendingStudentsPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (data: { maKhoaHoc: string; taiKhoan: string }) => 
      elearningService.approveStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingStudents', selectedCourse] });
      message.success('Duyệt học viên thành công!');
    },
    onError: () => {
      message.error('Duyệt học viên thất bại!');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { maKhoaHoc: string; taiKhoan: string }) => 
      elearningService.rejectStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingStudents', selectedCourse] });
      message.success('Từ chối học viên thành công!');
    },
    onError: () => {
      message.error('Từ chối học viên thất bại!');
    }
  });

  const handleApprove = (taiKhoan: string) => {
    if (selectedCourse) {
      approveMutation.mutate({
        maKhoaHoc: selectedCourse,
        taiKhoan
      });
    }
  };

  const handleReject = (taiKhoan: string) => {
    if (selectedCourse) {
      rejectMutation.mutate({
        maKhoaHoc: selectedCourse,
        taiKhoan
      });
    }
  };

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  const { data: pendingStudents, isLoading } = useQuery({
    queryKey: ['pendingStudents', selectedCourse],
    queryFn: () => elearningService.getPendingStudents(selectedCourse).then(res => res.data),
    enabled: !!selectedCourse
  });

  const filteredStudents = pendingStudents?.filter((student: PendingStudent) =>
    student.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
    student.email.toLowerCase().includes(searchText.toLowerCase()) ||
    student.taiKhoan.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const columns = [
    {
      title: 'Avatar',
      key: 'avatar',
      width: 80,
      render: () => (
        <Avatar icon={<UserOutlined />} className="bg-orange-500" />
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
      dataIndex: 'soDT',
      key: 'soDT',
      width: 130,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: () => (
        <Tag color="orange">Chờ xét duyệt</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: PendingStudent) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            className="bg-green-600 border-green-600"
            loading={approveMutation.isPending}
            onClick={() => handleApprove(record.taiKhoan)}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseOutlined />}
            loading={rejectMutation.isPending}
            onClick={() => handleReject(record.taiKhoan)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Title level={2} className="!mb-2">Học viên chờ xét duyệt</Title>
        <p className="text-gray-600">Quản lý danh sách học viên đăng ký khóa học chờ xét duyệt</p>
      </div>

      <Card>
        <div className="mb-4 flex gap-4">
          <Select
            placeholder="Chọn khóa học"
            size="large"
            className="w-80"
            allowClear
            onChange={setSelectedCourse}
          >
            {courses?.map((course: Course) => (
              <Option key={course.maKhoaHoc} value={course.maKhoaHoc}>
                {course.tenKhoaHoc}
              </Option>
            ))}
          </Select>
          
          <Search
            placeholder="Tìm kiếm học viên..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            disabled={!selectedCourse}
          />
        </div>

        {!selectedCourse ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <Title level={3} className="text-gray-500">
              Chọn khóa học để xem danh sách
            </Title>
            <p className="text-gray-400">
              Vui lòng chọn một khóa học để xem danh sách học viên chờ xét duyệt
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStudents}
            rowKey="taiKhoan"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} học viên`,
            }}
            scroll={{ x: 1000 }}
          />
        )}
      </Card>
    </div>
  );
}