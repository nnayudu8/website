import "./globals.css";
import NowPlaying from '@/components/NowPlaying';
// import AnimatedBlobsBackground from '@/components/AnimatedBlobsBackground';

export const metadata = {
  title: 'Nidhil Nayudu',
  description: 'Software Engineer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <AnimatedBlobsBackground /> */}
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
        >
          <div className="max-w-[95vw] sm:max-w-md">
            <NowPlaying />
          </div>
        </div>
      </body>
    </html>
  );
}
