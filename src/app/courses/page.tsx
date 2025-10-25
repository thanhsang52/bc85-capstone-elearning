'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Row, Col, Button, Typography, Input, Select, Pagination, Badge, Rate, Spin } from 'antd';
import { SearchOutlined, PlayCircleOutlined, UserOutlined, ClockCircleOutlined, FilterOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { elearningService, Course } from '../../services/elearningService';
import CourseCard from '../../components/CourseCard';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Set initial category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => elearningService.getCategoryList().then(res => res.data)
  });

  // Filter courses
  const filteredCourses = courses?.filter((course: Course) => {
    const matchesSearch = course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.moTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.maKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.danhMucKhoaHoc.maDanhMucKhoahoc === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Paginate courses
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + pageSize);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="!text-white !mb-4">
            📚 Danh Mục Khóa Học
          </Title>
          <Paragraph className="!text-blue-100 text-lg mb-8">
            Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu
          </Paragraph>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Search
                  placeholder="Tìm kiếm theo tên, mô tả hoặc mã khóa học..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  className="w-full"
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  placeholder="Chọn danh mục"
                  size="large"
                  className="w-full"
                  allowClear
                  loading={categoriesLoading}
                  onChange={handleCategoryChange}
                  suffixIcon={<FilterOutlined />}
                >
                  {categories?.map((category: any) => (
                    <Option key={category.maDanhMuc} value={category.maDanhMuc}>
                      {category.tenDanhMuc}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results Info */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Text className="text-gray-600">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + pageSize, filteredCourses.length)} 
                trong tổng số {filteredCourses.length} khóa học
              </Text>
              {searchTerm && (
                <Text className="text-blue-600 ml-2">
                  cho "{searchTerm}"
                </Text>
              )}
            </div>
          </div>

          {coursesLoading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <Title level={3} className="text-gray-500">
                Không tìm thấy khóa học nào
              </Title>
              <Paragraph className="text-gray-400">
                Thử thay đổi từ khóa tìm kiếm hoặc danh mục
              </Paragraph>
            </div>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {paginatedCourses.map((course: Course) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={course.maKhoaHoc}>
                    <CourseCard course={course} showCategory={true} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {filteredCourses.length > pageSize && (
                <div className="flex justify-center mt-12">
                  <Pagination
                    current={currentPage}
                    total={filteredCourses.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} trong ${total} khóa học`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}