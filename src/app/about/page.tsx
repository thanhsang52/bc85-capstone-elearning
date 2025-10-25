'use client';
import { Card, Row, Col, Typography, Statistic, Timeline } from 'antd';
import { BookOutlined, UserOutlined, TrophyOutlined, GlobalOutlined, HeartOutlined, RocketOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { elearningService } from '../../services/elearningService';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => elearningService.getCourseList().then(res => res.data)
  });

  const totalCourses = courses?.length || 0;
  const totalStudents = courses?.reduce((sum, course) => sum + course.soLuongHocVien, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="!text-white !mb-6 text-5xl">
            🎓 Về Chúng Tôi
          </Title>
          <Paragraph className="!text-blue-100 text-xl max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là nền tảng học trực tuyến hàng đầu, cam kết mang đến những khóa học chất lượng cao 
            và trải nghiệm học tập tuyệt vời cho hàng triệu học viên trên toàn thế giới.
          </Paragraph>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={24} sm={12} lg={6}>
              <Card className="border-0 shadow-lg">
                <Statistic
                  title="Khóa học"
                  value={totalCourses}
                  prefix={<BookOutlined className="text-blue-600" />}
                  valueStyle={{ color: '#1890ff', fontSize: '2.5rem' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="border-0 shadow-lg">
                <Statistic
                  title="Học viên"
                  value={totalStudents}
                  prefix={<UserOutlined className="text-green-600" />}
                  valueStyle={{ color: '#52c41a', fontSize: '2.5rem' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="border-0 shadow-lg">
                <Statistic
                  title="Chứng chỉ"
                  value={Math.floor(totalStudents * 0.8)}
                  prefix={<TrophyOutlined className="text-orange-600" />}
                  valueStyle={{ color: '#fa8c16', fontSize: '2.5rem' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="border-0 shadow-lg">
                <Statistic
                  title="Quốc gia"
                  value={50}
                  prefix={<GlobalOutlined className="text-purple-600" />}
                  valueStyle={{ color: '#722ed1', fontSize: '2.5rem' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="text-4xl mb-6">Sứ Mệnh Của Chúng Tôi</Title>
          </div>
          
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <Card className="h-full border-0 shadow-lg">
                <div className="text-center p-6">
                  <HeartOutlined className="text-6xl text-red-500 mb-6" />
                  <Title level={3} className="mb-4">Đam Mê Giáo Dục</Title>
                  <Paragraph className="text-lg text-gray-600 leading-relaxed">
                    Chúng tôi tin rằng giáo dục là chìa khóa để mở ra tương lai tươi sáng. 
                    Với đam mê và tận tâm, chúng tôi không ngừng cải tiến để mang đến 
                    những trải nghiệm học tập tốt nhất.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card className="h-full border-0 shadow-lg">
                <div className="text-center p-6">
                  <RocketOutlined className="text-6xl text-blue-500 mb-6" />
                  <Title level={3} className="mb-4">Đổi Mới Sáng Tạo</Title>
                  <Paragraph className="text-lg text-gray-600 leading-relaxed">
                    Chúng tôi luôn tiên phong trong việc ứng dụng công nghệ mới nhất 
                    vào giáo dục, tạo ra những phương pháp học tập hiệu quả và thú vị 
                    cho mọi đối tượng học viên.
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="text-4xl mb-6">Hành Trình Phát Triển</Title>
          </div>
          
          <Timeline
            mode="alternate"
            items={[
              {
                children: (
                  <Card className="shadow-lg">
                    <Title level={4}>2020 - Khởi Đầu</Title>
                    <Paragraph>
                      Ra mắt nền tảng với 10 khóa học đầu tiên và 100 học viên đăng ký.
                    </Paragraph>
                  </Card>
                ),
                color: 'blue',
              },
              {
                children: (
                  <Card className="shadow-lg">
                    <Title level={4}>2021 - Mở Rộng</Title>
                    <Paragraph>
                      Phát triển lên 100+ khóa học với hơn 10,000 học viên trên toàn quốc.
                    </Paragraph>
                  </Card>
                ),
                color: 'green',
              },
              {
                children: (
                  <Card className="shadow-lg">
                    <Title level={4}>2022 - Đột Phá</Title>
                    <Paragraph>
                      Đạt mốc 500+ khóa học và 100,000+ học viên, mở rộng ra thị trường quốc tế.
                    </Paragraph>
                  </Card>
                ),
                color: 'orange',
              },
              {
                children: (
                  <Card className="shadow-lg">
                    <Title level={4}>2024 - Hiện Tại</Title>
                    <Paragraph>
                      Trở thành nền tảng học trực tuyến hàng đầu với hàng nghìn khóa học chất lượng cao.
                    </Paragraph>
                  </Card>
                ),
                color: 'purple',
              },
            ]}
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="text-4xl mb-6">Giá Trị Cốt Lõi</Title>
          </div>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="text-5xl mb-4">🎯</div>
                  <Title level={4} className="mb-4">Chất Lượng</Title>
                  <Paragraph className="text-gray-600">
                    Cam kết mang đến những khóa học chất lượng cao từ các chuyên gia hàng đầu.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="text-5xl mb-4">🤝</div>
                  <Title level={4} className="mb-4">Hỗ Trợ</Title>
                  <Paragraph className="text-gray-600">
                    Đồng hành cùng học viên trong suốt hành trình học tập và phát triển.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="text-5xl mb-4">🌟</div>
                  <Title level={4} className="mb-4">Xuất Sắc</Title>
                  <Paragraph className="text-gray-600">
                    Không ngừng cải tiến và đổi mới để trở thành nền tảng học tập tốt nhất.
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Title level={2} className="!text-white !mb-6">
            Bắt Đầu Hành Trình Học Tập Cùng Chúng Tôi
          </Title>
          <Paragraph className="!text-green-100 text-lg mb-8">
            Tham gia cộng đồng học viên và khám phá hàng nghìn khóa học chất lượng cao
          </Paragraph>
          <button 
            onClick={() => window.location.href = '/courses'}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Khám Phá Khóa Học Ngay
          </button>
        </div>
      </section>
    </div>
  );
}