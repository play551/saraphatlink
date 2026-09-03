'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  count?: number;
  className?: string;
}

export function RatingStars({
  value,
  max = 5,
  size = 14,
  interactive = false,
  onChange,
  showValue = false,
  count,
  className,
}: RatingStarsProps) {
  const [hover, setHover] = useState(0);
  const display = interactive && hover > 0 ? hover : value;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHover(0)}
        role={interactive ? 'radiogroup' : undefined}
        aria-label={`คะแนน ${value} จาก ${max}`}
      >
        {Array.from({ length: max }).map((_, i) => {
          const idx = i + 1;
          const filled = display >= idx;
          const half = !filled && display >= idx - 0.5;

          const star = (
            <span key={idx} className="relative inline-flex">
              <Icon
                name="star"
                size={size}
                className={cn(
                  'transition-colors duration-150',
                  filled || half ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                )}
              />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden text-amber-400"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Icon name="star-filled" size={size} />
                </span>
              )}
            </span>
          );

          return interactive ? (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={value === idx}
              aria-label={`ให้ ${idx} ดาว`}
              onMouseEnter={() => setHover(idx)}
              onClick={() => onChange?.(idx)}
              className="transition-transform duration-150 hover:scale-125 active:scale-95"
            >
              {star}
            </button>
          ) : (
            star
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && count > 0 && (
        <span className="text-[11px] text-muted">
          ({count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count})
        </span>
      )}
    </div>
  );
}

export default RatingStars;
