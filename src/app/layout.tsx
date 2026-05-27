import "./globals.css";
import CustomCursor from '@/components/CustomCursor';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import localFont from 'next/font/local';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

const sentient = localFont({
  src: '../fonts/Sentient-Variable.woff2',
  variable: '--font-sentient',
  weight: '100 900',
  style: 'normal',
});

export const metadata: Metadata = {
  title: 'Nidhil Nayudu',
  description: 'Software Engineer',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${sentient.variable} ${manrope.variable} font-manrope`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
