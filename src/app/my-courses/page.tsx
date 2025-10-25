'use client';
import { useEffect, useState } from 'react';
import { Row, Col, Typography, Empty, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../store';
import { elearningService, Course } from '../../services/elearningService';
import CourseCard from '../../components/CourseCard';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function MyCoursesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);
  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>([]);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Lấy danh sách khóa học đã đăng ký từ localStorage
  useEffect(() => {
    if (user?.taiKhoan) {
      const stored = localStorage.getItem(`registeredCourses_${user.taiKhoan}`);
      setRegisteredCourseIds(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  // Fetch tất cả khóa học
  const { data: allCourses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  // Lọc ra các khóa học đã đăng ký
  const myCourses = allCourses?.filter((course: Course) => 
    registeredCourseIds.includes(course.maKhoaHoc)
  ) || [];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="!text-white !mb-4">
            📚 Khóa Học Của Tôi
          </Title>
          <Paragraph className="!text-green-100 text-lg">
            Tiếp tục hành trình học tập của bạn với {myCourses.length} khóa học đã đăng ký
          </Paragraph>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
            </div>
          ) : myCourses.length === 0 ? (
            <div className="text-center py-20">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Title level={3} className="text-gray-500 mb-4">
                      Bạn chưa đăng ký khóa học nào
                    </Title>
                    <Paragraph className="text-gray-400 mb-6">
                      Khám phá hàng nghìn khóa học chất lượng cao và bắt đầu học ngay hôm nay!
                    </Paragraph>
                    <button 
                      onClick={() => router.push('/courses')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Khám phá khóa học
                    </button>
                  </div>
                }
              />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Title level={2} className="text-gray-800">
                  Khóa học đã đăng ký ({myCourses.length})
                </Title>
                <Paragraph className="text-gray-600">
                  Tiếp tục học tập và hoàn thành các khóa học của bạn
                </Paragraph>
              </div>

              <Row gutter={[24, 24]}>
                {myCourses.map((course: Course) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={course.maKhoaHoc}>
                    <CourseCard course={course} showCategory={true} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </section>
    </div>
  );
}