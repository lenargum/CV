import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type RevealTag = 'div' | 'section' | 'article';

interface RevealProps {
  children: ReactNode;
  /** Which element to render. Keeps DOM semantics identical to the original markup. */
  as?: RevealTag;
  className?: string;
  /** Stagger position — final delay = delay + index * step. */
  index?: number;
  /** Base delay in seconds. */
  delay?: number;
  /** Per-item stagger step in seconds. */
  step?: number;
  /** Rise distance in px before settling. */
  y?: number;
  /** How much of the element must be visible before it fires (0..1). */
  amount?: number;
  /** Render the plain element with no animation (e.g. nested/compact layouts). */
  disabled?: boolean;
}

/**
 * Scroll-into-view reveal: content springs up + fades in the first time it
 * enters the viewport (once per mount — re-runs when the CV re-mounts on a
 * profile/language View Transition, which reads as a pleasant re-reveal).
 *
 * Honors prefers-reduced-motion (renders static, no transform/opacity anim).
 * Printing is unaffected: the downloadable PDFs come from the separate /pdf
 * route, and a print-media guard in global.css neutralises any inline motion
 * styles if someone prints the live site mid-animation.
 */
export default function Reveal({
  children,
  as = 'div',
  className,
  index = 0,
  delay = 0,
  step = 0.07,
  y = 16,
  amount = 0.15,
  disabled = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce || disabled) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: delay + index * step }}
    >
      {children}
    </MotionTag>
  );
}
