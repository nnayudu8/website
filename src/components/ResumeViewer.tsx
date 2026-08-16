'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { useResumeTransition } from './ResumeTransitionProvider';

export default function ResumeViewer() {
  const router = useRouter();
  const { resumeReady } = useResumeTransition();

  return (
    <main className="resume-viewer">
      <div className="resume-viewer-toolbar">
        <button type="button" className="resume-viewer-action" onClick={() => router.back()}>
          <FiArrowLeft aria-hidden="true" />
          <span>Back</span>
        </button>
        <a className="resume-viewer-action" href="/resume?download=1">
          <FiDownload aria-hidden="true" />
          <span>Download</span>
        </a>
      </div>

      <iframe
        className="resume-viewer-frame"
        src="/resume#toolbar=0"
        title="Résumé PDF"
        onLoad={resumeReady}
      />
    </main>
  );
}
