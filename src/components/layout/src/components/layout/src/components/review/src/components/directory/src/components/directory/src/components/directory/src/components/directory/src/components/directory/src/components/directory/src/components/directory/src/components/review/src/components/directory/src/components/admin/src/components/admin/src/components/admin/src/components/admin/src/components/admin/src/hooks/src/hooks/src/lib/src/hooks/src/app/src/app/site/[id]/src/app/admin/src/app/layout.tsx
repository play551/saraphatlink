import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Navbar />
        {children}
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
