'use client';

import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiDownload, FiExternalLink } from 'react-icons/fi';
import { useResumeTransition } from './ResumeTransitionProvider';
import { isMobileResumeViewer } from '@/utils/isMobileResumeViewer';

export default function ResumeViewer() {
  const { closeResume, markResumeReady } = useResumeTransition();
  const backRef = useRef<HTMLButtonElement>(null);
  const [viewerMode, setViewerMode] = useState<'checking' | 'desktop' | 'mobile'>('checking');
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (isMobileResumeViewer()) {
      setViewerMode('mobile');
      window.location.replace('/resume');
      return;
    }

    setViewerMode('desktop');
    backRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(timer);
  }, [attempt, loaded]);

  const retry = () => {
    setLoaded(false);
    setSlow(false);
    setAttempt((value) => value + 1);
  };

  return (
    <main className="resume-viewer">
      <header className="resume-viewer-toolbar">
        <button
          ref={backRef}
          type="button"
          onClick={(event) => closeResume(event.currentTarget)}
          className="resume-viewer-action"
          aria-label="Back to portfolio"
        >
          <FiArrowLeft size={17} />
          <span>Back</span>
        </button>

        <p className="resume-viewer-title">Nidhil Nayudu · Résumé</p>

        <div className="resume-viewer-actions">
          <a href="/resume" target="_blank" rel="noopener noreferrer" className="resume-viewer-action">
            <FiExternalLink size={16} />
            <span>Open</span>
          </a>
          <a href="/resume" download="Nidhil_Nayudu_resume.pdf" className="resume-viewer-action">
            <FiDownload size={16} />
            <span>Download</span>
          </a>
        </div>
      </header>

      <section className="resume-viewer-stage" aria-busy={!loaded}>
        {!loaded && (
          <div className="resume-loading" role="status" aria-live="polite">
            <div className="resume-loading-page" aria-hidden="true">
              <span className="resume-loading-line resume-loading-line--title" />
              <span className="resume-loading-line" />
              <span className="resume-loading-line resume-loading-line--short" />
              <span className="resume-loading-line" />
              <span className="resume-loading-line resume-loading-line--short" />
            </div>
            <p>{slow ? 'The résumé is taking a little longer.' : 'Opening résumé…'}</p>
            {slow && (
              <div className="resume-loading-actions">
                <button type="button" onClick={retry}>Retry</button>
                <a href="/resume" download="Nidhil_Nayudu_resume.pdf">Download</a>
              </div>
            )}
          </div>
        )}

        {viewerMode === 'desktop' && (
          <iframe
            key={attempt}
            src="/resume"
            title="Nidhil Nayudu résumé"
            className="resume-document"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => {
              setLoaded(true);
              markResumeReady();
            }}
          />
        )}
      </section>
    </main>
  );
}
