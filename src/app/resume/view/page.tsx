import type { Metadata } from 'next';
import ResumeViewer from '@/components/ResumeViewer';

export const metadata: Metadata = {
  title: 'Résumé · Nidhil Nayudu',
  description: 'Nidhil Nayudu résumé',
};

export default function ResumeViewPage() {
  return <ResumeViewer />;
}
