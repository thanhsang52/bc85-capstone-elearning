'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ConfigProvider locale={viVN}>
              <LayoutContent>{children}</LayoutContent>
            </ConfigProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}