'use client';

import { useResumeTransition } from './ResumeTransitionProvider';

interface ResumeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkId: string;
}

export default function ResumeLink({ linkId, onClick, ...props }: ResumeLinkProps) {
  const { openResume, transitioning } = useResumeTransition();

  return (
    <a
      {...props}
      href="/resume/view"
      data-resume-link={linkId}
      aria-disabled={transitioning || undefined}
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
