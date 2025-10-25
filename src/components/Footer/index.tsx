'use client';
import { Layout, Row, Col, Typography, Button } from 'antd';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, YoutubeOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <div className="mb-6">
              <div className="mb-4">
                <img 
                  src="https://elearning.iigvietnam.com/images/logo.png" 
                  alt="Logo" 
                  className="h-16 w-auto mb-4"
                />
              </div>
              <div className="flex gap-3">
                <Button type="text" icon={<FacebookOutlined />} className="text-gray-400 hover:text-blue-500" />
                <Button type="text" icon={<TwitterOutlined />} className="text-gray-400 hover:text-blue-400" />
                <Button type="text" icon={<LinkedinOutlined />} className="text-gray-400 hover:text-blue-600" />
                <Button type="text" icon={<YoutubeOutlined />} className="text-gray-400 hover:text-red-500" />
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <Title level={5} className="text-gray-900 mb-4">Khóa học</Title>
            <div className="space-y-2">
              <div><Link href="/courses/programming" className="text-gray-600 hover:text-blue-600">Lập trình</Link></div>
              <div><Link href="/courses/design" className="text-gray-600 hover:text-blue-600">Thiết kế</Link></div>
              <div><Link href="/courses/marketing" className="text-gray-600 hover:text-blue-600">Marketing</Link></div>
              <div><Link href="/courses/business" className="text-gray-600 hover:text-blue-600">Kinh doanh</Link></div>
              <div><Link href="/courses/language" className="text-gray-600 hover:text-blue-600">Ngoại ngữ</Link></div>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <Title level={5} className="text-gray-900 mb-4">Hỗ trợ</Title>
            <div className="space-y-2">
              <div><Link href="/help" className="text-gray-600 hover:text-blue-600">Trung tâm trợ giúp</Link></div>
              <div><Link href="/faq" className="text-gray-600 hover:text-blue-600">Câu hỏi thường gặp</Link></div>
              <div><Link href="/contact" className="text-gray-600 hover:text-blue-600">Liên hệ</Link></div>
              <div><Link href="/terms" className="text-gray-600 hover:text-blue-600">Điều khoản sử dụng</Link></div>
              <div><Link href="/privacy" className="text-gray-600 hover:text-blue-600">Chính sách bảo mật</Link></div>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <Title level={5} className="text-gray-900 mb-4">Liên hệ</Title>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <EnvironmentOutlined className="text-blue-500" />
                <Text className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</Text>
              </div>
              <div className="flex items-center gap-3">
                <PhoneOutlined className="text-green-500" />
                <Text className="text-gray-600">1900-1234</Text>
              </div>
              <div className="flex items-center gap-3">
                <MailOutlined className="text-red-500" />
                <Text className="text-gray-600">info@elearning.com</Text>
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <Text className="text-gray-500">
            © 2024 E-Learning Platform. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;