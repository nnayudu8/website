'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeTransition } from './ResumeTransitionProvider';

interface ResumeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkId: string;
}

export default function ResumeLink({ linkId, onClick, onFocus, onMouseEnter, ...props }: ResumeLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const { openResume, transitioning } = useResumeTransition();

  const prefetch = useCallback(() => router.prefetch('/resume/view'), [router]);

  useEffect(() => {
    const link = ref.current;
    if (!link || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        prefetch();
        observer.disconnect();
      }
    }, { rootMargin: '120px' });

    observer.observe(link);
    return () => observer.disconnect();
  }, [prefetch]);

  return (
    <a
      {...props}
      ref={ref}
      href="/resume/view"
      data-resume-link={linkId}
      aria-disabled={transitioning || undefined}
      onMouseEnter={(event) => {
        prefetch();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        prefetch();
        onFocus?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) return;

        event.preventDefault();
        if (!transitioning) openResume(event.currentTarget, linkId);
      }}
    />
  );
}
