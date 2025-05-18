import "./globals.css";
import NowPlaying from '@/components/NowPlaying';
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
  weight: '700',
  style: 'normal',
});

/**
 * Metadata configuration for the website
 */
export const metadata: Metadata = {
  title: 'Nidhil Nayudu',
  description: 'Software Engineer'
} as const;

/**
 * Props for the RootLayout component
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application
 * and provides the base HTML structure
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${sentient.variable} ${manrope.variable} font-sentient`}>
        {children}
        <div
          className="
            fixed
            bottom-4
            left-1/2
            -translate-x-1/2
            z-50
            w-full
            flex
            justify-center
            px-2
            sm:left-auto
            sm:right-4
            sm:translate-x-0
            sm:w-auto
            sm:justify-end
          "
          role="complementary"
          aria-label="Now playing music widget"
        >
          <div className="max-w-[95vw] sm:max-w-md">
            <NowPlaying />
          </div>
        </div>
      </body>
    </html>
  );
}
