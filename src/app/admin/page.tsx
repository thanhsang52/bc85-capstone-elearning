'use client';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { BookOutlined, UserOutlined, EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { elearningService } from '../../services/elearningService';

const { Title } = Typography;

export default function AdminDashboard() {
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  const totalCourses = courses?.length || 0;
  const totalStudents = courses?.reduce((sum, course) => sum + course.soLuongHocVien, 0) || 0;
  const totalViews = courses?.reduce((sum, course) => sum + course.luotXem, 0) || 0;

  return (
    <div>
      <Title level={2} className="mb-6">Dashboard</Title>
      
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng khóa học"
              value={totalCourses}
              prefix={<BookOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng học viên"
              value={totalStudents}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt xem"
              value={totalViews}
              prefix={<EyeOutlined className="text-orange-600" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khóa học nổi bật"
              value={Math.floor(totalCourses * 0.3)}
              prefix={<TrophyOutlined className="text-yellow-600" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Khóa học phổ biến" className="h-80">
            <div className="text-center text-gray-500 mt-16">
              Biểu đồ sẽ được phát triển
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây" className="h-80">
            <div className="text-center text-gray-500 mt-16">
              Danh sách hoạt động sẽ được phát triển
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}