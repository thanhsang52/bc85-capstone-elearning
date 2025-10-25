'use client';
import { useState } from 'react';
import { Table, Button, Input, Space, Tag, Typography, Card, Modal, Form, Select, message, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { elearningService, Course } from '../../../services/elearningService';

const { Title } = Typography;
const { Search } = Input;

export default function AdminCoursesPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();


  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => elearningService.getCategoryList().then(res => res.data)
  });

  const { data: courseStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['courseStudents', selectedCourse?.maKhoaHoc],
    queryFn: () => elearningService.getCourseStudents(selectedCourse!.maKhoaHoc).then(res => res.data),
    enabled: !!selectedCourse
  });

  const filteredCourses = courses?.filter((course: Course) => {
    const matchesSearch = course.tenKhoaHoc.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.moTa.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.maKhoaHoc.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || course.danhMucKhoaHoc.maDanhMucKhoahoc === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    form.resetFields();
  };

  const handleViewStudents = (course: Course) => {
    setSelectedCourse(course);
    setIsStudentsModalOpen(true);
  };

  const handleStudentsModalClose = () => {
    setIsStudentsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleSubmit = () => {
    message.success(editingCourse ? 'Cập nhật khóa học thành công!' : 'Thêm khóa học thành công!');
    handleModalClose();
  };

  const columns = [
    {
      title: 'Mã khóa học',
      dataIndex: 'maKhoaHoc',
      key: 'maKhoaHoc',
      width: 120,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
      width: 250,
      render: (text: string) => <div className="font-medium">{text}</div>,
    },
    {
      title: 'Danh mục',
      dataIndex: ['danhMucKhoaHoc', 'tenDanhMucKhoaHoc'],
      key: 'category',
      width: 150,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      width: 100,
      sorter: (a: Course, b: Course) => a.soLuongHocVien - b.soLuongHocVien,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'luotXem',
      key: 'luotXem',
      width: 100,
      sorter: (a: Course, b: Course) => a.luotXem - b.luotXem,
    },
    {
      title: 'Người tạo',
      dataIndex: ['nguoiTao', 'hoTen'],
      key: 'nguoiTao',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Course) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/course/${record.maKhoaHoc}`, '_blank')}
            title="Xem khóa học"
          />
          <Button
            type="text"
            icon={<TeamOutlined />}
            onClick={() => handleViewStudents(record)}
            title="Xem học viên"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.info('Tính năng xóa sẽ được phát triển')}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">Quản lý khóa học</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-blue-600"
        >
          Thêm khóa học
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex gap-4">
          <Search
            placeholder="Tìm kiếm theo tên, mô tả hoặc mã khóa học..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
          <Select
            placeholder="Lọc theo danh mục"
            size="large"
            className="w-64"
            allowClear
            loading={categoriesLoading}
            onChange={setSelectedCategory}
          >
            {categories?.map((category: { maDanhMuc: string; tenDanhMuc: string }) => (
              <Select.Option key={category.maDanhMuc} value={category.maDanhMuc}>
                {category.tenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="maKhoaHoc"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} khóa học`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
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
            name="tenKhoaHoc"
            label="Tên khóa học"
            rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
          >
            <Input placeholder="Nhập tên khóa học" />
          </Form.Item>

          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học" />
          </Form.Item>

          <Form.Item
            name="danhMucKhoaHoc"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories?.map((cat: { maDanhMuc: string; tenDanhMuc: string }) => (
                <Select.Option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                  {cat.tenDanhMuc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hinhAnh"
            label="Hình ảnh (URL)"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleModalClose}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              {editingCourse ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={`Danh sách học viên - ${selectedCourse?.tenKhoaHoc}`}
        open={isStudentsModalOpen}
        onCancel={handleStudentsModalClose}
        footer={null}
        width={800}
      >
        <Table
          columns={[
            {
              title: 'Avatar',
              key: 'avatar',
              width: 80,
              render: () => (
                <Avatar icon={<UserOutlined />} className="bg-blue-600" />
              ),
            },
            {
              title: 'Tài khoản',
              dataIndex: 'taiKhoan',
              key: 'taiKhoan',
            },
            {
              title: 'Họ tên',
              dataIndex: 'hoTen',
              key: 'hoTen',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Số điện thoại',
              dataIndex: 'soDT',
              key: 'soDT',
            },
          ]}
          dataSource={courseStudents}
          rowKey="taiKhoan"
          loading={studentsLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} học viên`,
          }}
        />
      </Modal>
    </div>
  );
}