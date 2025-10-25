'use client';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Typography, Row, Col, Tag, Rate, Divider, Avatar } from 'antd';
import { PlayCircleOutlined, UserOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { elearningService } from '../../../services/elearningService';
import { useCourseRegistration } from '../../../hook/useCourseRegistration';
import CourseImage from '../../../components/CourseImage';

const { Title, Paragraph, Text } = Typography;

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const { handleRegisterCourse, isLoading: registering, isRegistered } = useCourseRegistration(courseId);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => elearningService.getCourseDetail(courseId).then(res => res.data),
    enabled: !!courseId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <Title level={3} className="text-gray-500">Không tìm thấy khóa học</Title>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={14}>
              <div className="text-white">
                <Tag color="orange" className="mb-4">
                  {course.danhMucKhoaHoc.tenDanhMucKhoaHoc}
                </Tag>
                <Title level={1} className="!text-white !mb-4">
                  {course.tenKhoaHoc}
                </Title>
                <Paragraph className="!text-blue-100 text-lg mb-6">
                  {course.moTa}
                </Paragraph>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Rate disabled defaultValue={4.5} className="text-yellow-400" />
                    <Text className="text-blue-100">(4.5)</Text>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <UserOutlined />
                    <span>{course.soLuongHocVien} học viên</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <ClockCircleOutlined />
                    <span>{course.luotXem} lượt xem</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <Avatar icon={<UserOutlined />} size="large" />
                  <div>
                    <Text className="text-white font-semibold block">
                      {course.nguoiTao.hoTen}
                    </Text>
                    <Text className="text-blue-200 text-sm">
                      {course.nguoiTao.tenLoaiNguoiDung}
                    </Text>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isRegistered ? (
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<PlayCircleOutlined />}
                      onClick={() => router.push(`/learning/${courseId}`)}
                      className="bg-green-600 text-white border-none font-semibold hover:bg-green-700"
                    >
                      Vào Học Ngay
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      size="large"
                      loading={registering}
                      onClick={() => handleRegisterCourse(courseId)}
                      className="bg-white text-blue-600 border-none font-semibold hover:bg-gray-100"
                    >
                      Đăng Ký Học
                    </Button>
                  )}
                  <Button 
                    size="large"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Xem Demo
                  </Button>
                </div>
              </div>
            </Col>
            
            <Col xs={24} lg={10}>
              <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
                <div className="relative">
                  <CourseImage
                    alt={course.tenKhoaHoc}
                    src={course.hinhAnh}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<PlayCircleOutlined />}
                      className="bg-white text-black border-none font-semibold text-lg px-8 py-6 h-auto"
                    >
                      Xem Preview
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <Card className="shadow-lg border-0 rounded-2xl">
                <Title level={2} className="mb-6">
                  📚 Nội dung khóa học
                </Title>
                <Paragraph className="text-gray-600 text-lg leading-relaxed">
                  {course.moTa}
                </Paragraph>
                
                <Divider />
                
                <Title level={3} className="mb-4">
                  🎯 Bạn sẽ học được gì?
                </Title>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Nắm vững kiến thức cơ bản và nâng cao</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Thực hành với các dự án thực tế</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Được hướng dẫn bởi chuyên gia có kinh nghiệm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Nhận chứng chỉ hoàn thành khóa học</span>
                  </li>
                </ul>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card className="shadow-lg border-0 rounded-2xl sticky">
                <div className="text-center mb-6">
                  <Text className="text-4xl font-bold text-red-500">MIỄN PHÍ</Text>
                  <br />
                  <Text className="text-gray-500 line-through">2,000,000đ</Text>
                </div>
                
                {isRegistered ? (
                  <Button 
                    type="primary" 
                    size="large"
                    block
                    onClick={() => router.push(`/learning/${courseId}`)}
                    icon={<PlayCircleOutlined />}
                    className="bg-green-600 border-none font-semibold mb-4 h-12 hover:bg-green-700"
                  >
                    Vào Học Ngay
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    size="large"
                    block
                    loading={registering}
                    onClick={() => handleRegisterCourse(courseId)}
                    icon={<BookOutlined />}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none font-semibold mb-4 h-12"
                  >
                    Đăng Ký Học Ngay
                  </Button>
                )}
                
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Thời lượng:</span>
                    <span className="font-semibold">40+ giờ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bài học:</span>
                    <span className="font-semibold">50+ bài</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cấp độ:</span>
                    <span className="font-semibold">Tất cả</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngôn ngữ:</span>
                    <span className="font-semibold">Tiếng Việt</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chứng chỉ:</span>
                    <span className="font-semibold">Có</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}