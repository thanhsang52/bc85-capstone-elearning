'use client';
import { Row, Col, Button, Typography, Badge } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { elearningService, Course } from '../services/elearningService';
import CourseCard from '../components/CourseCard';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  const featuredCourses = courses?.slice(0, 8) || [];

  return (
    <div className="min-h-screen">
      

      {/* Banner Section */}
      <section 
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white/70"></div>
        <div className="relative z-10 text-center text-gray-800 w-full px-4">
          <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-sm rounded-2xl p-8">
            <Title level={1} className="!text-gray-800 !mb-6 text-4xl md:text-5xl lg:text-6xl font-bold" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
              🚀 Bắt đầu hành trình học tập!
            </Title>
            <Paragraph className="!text-lg md:text-xl lg:text-2xl !text-gray-700 !mb-8 leading-relaxed" style={{textShadow: '1px 1px 1px rgba(255,255,255,0.6)'}}>
              Tham gia cùng hàng nghìn học viên đã thành công với các khóa học chất lượng cao
            </Paragraph>
            <div className="flex flex-row gap-6 justify-center items-center">
              <Link href="/courses">
                <Button 
                  type="primary" 
                  size="large" 
                  className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 font-semibold px-12 py-6 h-auto text-lg shadow-lg"
                >
                  Khám phá ngay
                </Button>
              </Link>
              &nbsp;
              <Button 
                type="default" 
                size="large" 
                className="border-gray-600 text-gray-700 bg-white/50 hover:bg-white hover:text-blue-600 font-semibold px-12 py-6 h-auto text-lg shadow-lg"
              >
                Xem demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2} className="text-4xl font-bold text-gray-900 mb-6">
              🔥 Khóa Học Hot Nhất
            </Title>
            <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những khóa học được yêu thích và đánh giá cao nhất từ cộng đồng học viên
            </Paragraph>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {featuredCourses.map((course: Course) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={course.maKhoaHoc}>
                  <div className="relative">
                    <CourseCard course={course} />
                    <div className="absolute top-3 left-3 z-10">
                      <Badge count="HOT" style={{ backgroundColor: '#ff4d4f' }} />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
          
          <div className="text-center mt-16">
            <Link href="/courses">
              <Button 
                type="primary" 
                size="large" 
                className="bg-gradient-to-r from-orange-500 to-red-500 border-none px-12 py-6 h-auto text-lg font-semibold"
              >
                Xem Tất Cả 1000+ Khóa Học
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}