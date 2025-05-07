import "./globals.css";

export const metadata = {
  title: 'Nidhil Nayudu',
  description: 'Software Engineer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
