import "./globals.css";
import NowPlaying from '@/components/NowPlaying';

export const metadata = {
  title: 'Nidhil Nayudu',
  description: 'Software Engineer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '40px',
            zIndex: 1000,
          }}
        >
          <NowPlaying />
        </div>
      </body>
    </html>
  );
}
