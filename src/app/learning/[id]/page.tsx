'use client';
import { useParams } from 'next/navigation';
import { Card, Typography, Button } from 'antd';
import { PlayCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { elearningService } from '../../../services/elearningService';

const { Title, Paragraph } = Typography;

export default function LearningPage() {
  const params = useParams();
  const courseId = params?.id as string;

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
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="shadow-lg border-0 rounded-2xl">
          <div className="text-center mb-8">
            <Title level={1} className="text-blue-600 mb-4">
              🎓 {course?.tenKhoaHoc}
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Chào mừng bạn đến với khóa học! Trang học sẽ được phát triển trong tương lai.
            </Paragraph>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              type="primary" 
              size="large"
              icon={<PlayCircleOutlined />}
              className="bg-blue-600 border-none font-semibold"
            >
              Bắt đầu học
            </Button>
            <Button 
              size="large"
              icon={<BookOutlined />}
              className="border-blue-600 text-blue-600"
            >
              Tài liệu
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}