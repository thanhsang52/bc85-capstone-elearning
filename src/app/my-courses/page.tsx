'use client';
import { useEffect, useState } from 'react';
import { Row, Col, Typography, Empty, Spin, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../store';
import { elearningService, Course } from '../../services/elearningService';
import CourseCard from '../../components/CourseCard';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function MyCoursesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userSlice);
  const [localStorageCourses, setLocalStorageCourses] = useState<string[]>([]);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Lấy danh sách từ localStorage cho học viên
  useEffect(() => {
    if (user?.taiKhoan && user?.maLoaiNguoiDung === 'HV') {
      const stored = localStorage.getItem(`registeredCourses_${user.taiKhoan}`);
      setLocalStorageCourses(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  // Fetch khóa học đã duyệt (chỉ cho giáo viên)
  const { data: approvedCourses, isLoading: approvedLoading } = useQuery({
    queryKey: ['userApprovedCourses', user?.taiKhoan],
    queryFn: () => elearningService.getUserApprovedCourses(user!.taiKhoan).then(res => res.data),
    enabled: !!user?.taiKhoan && user?.maLoaiNguoiDung === 'GV'
  });

  // Fetch khóa học chờ duyệt (chỉ cho giáo viên)
  const { data: pendingCourses, isLoading: pendingLoading } = useQuery({
    queryKey: ['userPendingCourses', user?.taiKhoan],
    queryFn: () => elearningService.getUserPendingCourses(user!.taiKhoan).then(res => res.data),
    enabled: !!user?.taiKhoan && user?.maLoaiNguoiDung === 'GV'
  });

  // Fetch tất cả khóa học để lọc cho học viên
  const { data: allCourses, isLoading: allCoursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data),
    enabled: !!user?.taiKhoan && user?.maLoaiNguoiDung === 'HV'
  });

  // Lọc khóa học cho học viên từ localStorage
  const studentCourses = allCourses?.filter((course: Course) => 
    localStorageCourses.includes(course.maKhoaHoc)
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
            Tiếp tục hành trình học tập của bạn với {user?.maLoaiNguoiDung === 'HV' ? studentCourses.length : (approvedCourses?.length || 0) + (pendingCourses?.length || 0)} khóa học
          </Paragraph>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {user?.maLoaiNguoiDung === 'HV' ? (
            // Hiển thị cho học viên
            allCoursesLoading ? (
              <div className="text-center py-20">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
              </div>
            ) : studentCourses.length === 0 ? (
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
              <div>
                <div className="mb-8">
                  <Title level={2} className="text-gray-800">
                    Khóa học đã đăng ký ({studentCourses.length})
                  </Title>
                  <Paragraph className="text-gray-600">
                    Tiếp tục học tập và hoàn thành các khóa học của bạn
                  </Paragraph>
                </div>
                <Row gutter={[24, 24]}>
                  {studentCourses.map((course: Course) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={course.maKhoaHoc}>
                      <CourseCard course={course} showCategory={true} />
                    </Col>
                  ))}
                </Row>
              </div>
            )
          ) : (
            // Hiển thị cho giáo viên
            (approvedLoading || pendingLoading) ? (
              <div className="text-center py-20">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
              </div>
            ) : (!approvedCourses?.length && !pendingCourses?.length) ? (
              <div className="text-center py-20">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <Title level={3} className="text-gray-500 mb-4">
                        Chưa có khóa học nào
                      </Title>
                      <Paragraph className="text-gray-400 mb-6">
                        Khóa học sẽ hiển thị khi có học viên đăng ký
                      </Paragraph>
                    </div>
                  }
                />
              </div>
            ) : (
              <Tabs defaultActiveKey="approved" size="large">
                <TabPane tab={`Đã duyệt (${approvedCourses?.length || 0})`} key="approved">
                  {approvedCourses?.length ? (
                    <Row gutter={[24, 24]}>
                      {approvedCourses.map((course: Course) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={course.maKhoaHoc}>
                          <CourseCard course={course} showCategory={true} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-12">
                      <Empty description="Chưa có khóa học nào được duyệt" />
                    </div>
                  )}
                </TabPane>
                
                <TabPane tab={`Chờ duyệt (${pendingCourses?.length || 0})`} key="pending">
                  {pendingCourses?.length ? (
                    <Row gutter={[24, 24]}>
                      {pendingCourses.map((course: Course) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={course.maKhoaHoc}>
                          <CourseCard course={course} showCategory={true} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-12">
                      <Empty description="Chưa có khóa học nào chờ duyệt" />
                    </div>
                  )}
                </TabPane>
              </Tabs>
            )
          )}
        </div>
      </section>
    </div>
  );
}