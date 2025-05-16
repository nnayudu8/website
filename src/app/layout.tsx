import "./globals.css";
import NowPlaying from '@/components/NowPlaying';
import type { Metadata } from 'next';

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
      <body>
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
