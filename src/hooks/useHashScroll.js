import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function scrollToHashTarget(hash, behavior = 'smooth') {
  if (!hash) return false;

  const targetId = decodeURIComponent(hash.replace(/^#/, ''));
  const target = document.getElementById(targetId);
  if (!target) return false;

  target.scrollIntoView({ behavior, block: 'start' });
  target.focus({ preventScroll: true });
  return true;
}

export default function useHashScroll(ready = true) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!ready) return;
    scrollToHashTarget(hash);
  }, [hash, ready]);
}
