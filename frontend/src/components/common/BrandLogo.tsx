import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className,
  href = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const svgSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const Content = (
    <div className={cn('inline-flex items-center gap-2.5 group select-none', className)}>
      <div
        className={cn(
          'flex items-center justify-center bg-foreground text-background border border-border/80 shadow-sm transition-transform group-hover:scale-105',
          iconSizes[size]
        )}
      >
        <GraduationCap className={svgSizes[size]} />
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={cn('font-extrabold tracking-tight text-foreground', textSizes[size])}>
            CampusCare
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-muted text-foreground border border-border/80">
            v1.0
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
            Smart Campus Operations
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{Content}</Link>;
  }

  return Content;
};

export default BrandLogo;
