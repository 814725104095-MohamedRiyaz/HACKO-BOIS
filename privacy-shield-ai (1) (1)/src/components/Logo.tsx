import React, { useState } from 'react';
import { BRANDING } from '../config/branding';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: { img: 'w-5 h-5', text: 'text-sm' },
  sm: { img: 'w-6 h-6', text: 'text-base' },
  md: { img: 'w-8 h-8', text: 'text-lg' },
  lg: { img: 'w-10 h-10', text: 'text-xl' },
  xl: { img: 'w-12 h-12', text: 'text-2xl' },
};

/**
 * Reusable Privexa AI Logo component.
 * Features:
 * - Responsive scaling with preset sizes
 * - Graceful fallback from bundled asset to public static path
 * - Accessible alt tags
 * - Optional text label
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = 'font-black tracking-tight text-white',
  className = '',
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(BRANDING.logo.src);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const handleImageError = () => {
    // Fallback to static public root path if bundled asset fails
    if (imgSrc !== BRANDING.logo.publicPath) {
      setImgSrc(BRANDING.logo.publicPath);
    }
  };

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${sizeConfig.img} rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs`}>
        <img
          src={imgSrc}
          alt={BRANDING.logo.alt}
          onError={handleImageError}
          className="w-full h-full object-contain rounded-xl"
          loading="eager"
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${sizeConfig.text} ${textClassName}`}>
            {BRANDING.name}
          </span>
          {size === 'md' || size === 'lg' || size === 'xl' ? (
            <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
              Zero-Exposure Privacy
            </span>
          ) : null}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
        aria-label="Go to Privexa AI Dashboard"
      >
        {content}
      </button>
    );
  }

  return content;
};
