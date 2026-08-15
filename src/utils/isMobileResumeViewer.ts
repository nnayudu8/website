export function isMobileResumeViewer() {
  return (
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1) ||
    window.matchMedia('(max-width: 767px) and (pointer: coarse)').matches
  );
}
