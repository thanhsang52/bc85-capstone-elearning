'use client';
import { Card, Button, Typography, Badge, Rate } from 'antd';
import { PlayCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Course } from '../../services/elearningService';
import { useCourseRegistration } from '../../hook/useCourseRegistration';
import CourseImage from '../CourseImage';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

interface CourseCardProps {
  course: Course;
  showCategory?: boolean;
}

const CourseCard = ({ course, showCategory = false }: CourseCardProps) => {
  const { handleRegisterCourse, isLoading, isRegistered } = useCourseRegistration(course.maKhoaHoc);

  return (
    <Card
      hoverable
      className="h-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 rounded-xl overflow-hidden"
      cover={
        <div className="relative h-48 overflow-hidden">
          <CourseImage
            alt={course.tenKhoaHoc}
            src={course.hinhAnh}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                className="w-full bg-white text-black border-none font-semibold hover:bg-gray-100"
              >
                Xem Preview
              </Button>
            </div>
          </div>
          {showCategory && (
            <div className="absolute top-3 left-3">
              <Badge 
                count={course.danhMucKhoaHoc.tenDanhMucKhoaHoc} 
                style={{ backgroundColor: '#1890ff', fontSize: '10px' }} 
              />
            </div>
          )}
        </div>
      }
    >
      <div className="p-2">
        <Title level={5} className="mb-2 text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {course.tenKhoaHoc}
        </Title>
        
        <div className="flex items-center gap-2 mb-3">
          <Rate disabled defaultValue={4.5} className="text-xs" />
          <Text className="text-gray-500 text-xs">(4.5)</Text>
        </div>
        
        <Paragraph className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {course.moTa}
        </Paragraph>
        
        <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <UserOutlined />
            <span>{course.soLuongHocVien}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            <span>{course.luotXem} lượt xem</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Text className="text-lg font-bold text-red-500">FREE</Text>
          <div className="flex gap-2">
            <Link href={`/course/${course.maKhoaHoc}`}>
              <Button size="small" className="border-blue-600 text-blue-600">
                Chi tiết
              </Button>
            </Link>
            {isRegistered ? (
              <Link href={`/learning/${course.maKhoaHoc}`}>
                <Button 
                  type="primary" 
                  size="small"
                  className="bg-green-600 border-none font-semibold"
                >
                  Vào học
                </Button>
              </Link>
            ) : (
              <Button 
                type="primary" 
                size="small"
                loading={isLoading}
                onClick={() => handleRegisterCourse(course.maKhoaHoc)}
                className="bg-blue-600 border-none font-semibold"
              >
                Đăng ký
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;