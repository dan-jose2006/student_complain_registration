import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export interface LiquidMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  viewMode?: 'text' | 'icon';
  icon?: React.ReactNode;
  isLoading?: boolean;
  fluid?: boolean;
}

export const LiquidMetalButton: React.FC<LiquidMetalButtonProps> = ({
  label = 'Get Started',
  onClick,
  viewMode = 'text',
  icon,
  isLoading = false,
  fluid = false,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const displayLabel = children ? children : label;

  useEffect(() => {
    const styleId = 'shader-canvas-style-exploded';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
          }

          shaderMount.current = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4,
              u_softness: 0.5,
              u_shiftRed: isLight ? 0.1 : 0.3,
              u_shiftBlue: isLight ? 0.1 : 0.3,
              u_distortion: 0,
              u_contour: 0,
              u_angle: 45,
              u_scale: 8,
              u_shape: 1,
              u_offsetX: 0.1,
              u_offsetY: -0.1,
            },
            undefined,
            0.6
          );
        }
      } catch (error) {
        console.error('Failed to load liquid metal shader:', error);
      }
    };

    loadShader();

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, [isLight]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1.1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1.1);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        fluid ? 'w-full' : 'w-auto',
        className
      )}
    >
      <div
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
        className={fluid ? 'w-full' : 'w-auto'}
      >
        <div
          className={cn(
            'relative h-[46px] inline-flex items-center justify-center transition-all duration-300',
            viewMode === 'icon' ? 'w-[46px]' : fluid ? 'w-full' : 'w-auto min-w-[140px]'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'none',
          }}
        >
          {/* Flow Content Sizing Anchor: Guarantees button stretches naturally to fit text without clipping */}
          <div className="invisible pointer-events-none flex items-center justify-center gap-2 px-6 h-[46px] whitespace-nowrap text-sm font-semibold">
            {icon && <span className="w-4 h-4 inline-flex items-center justify-center">{icon}</span>}
            {viewMode === 'icon' && <span className="w-4 h-4 inline-flex items-center justify-center" />}
            {viewMode === 'text' && <span>{displayLabel}</span>}
          </div>

          {/* Foreground Text & Icon Layer */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-2.5 z-30 pointer-events-none px-6"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(20px)',
            }}
          >
            {isLoading ? (
              <Loader2 className={cn('w-4 h-4 animate-spin', isLight ? 'text-neutral-900' : 'text-white')} />
            ) : icon ? (
              <span className={cn('scale-95 transition-transform flex items-center justify-center', isLight ? 'text-neutral-900' : 'text-white')}>
                {icon}
              </span>
            ) : viewMode === 'icon' ? (
              <Sparkles className={cn('w-4 h-4 scale-95 transition-transform', isLight ? 'text-neutral-900' : 'text-white')} />
            ) : null}

            {viewMode === 'text' && (
              <span
                className={cn(
                  'text-sm font-semibold tracking-wide whitespace-nowrap transition-colors',
                  isLight
                    ? 'text-neutral-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
                    : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                )}
              >
                {displayLabel}
              </span>
            )}
          </div>

          {/* Inner Depth Body Plate - Adaptive to Light / Dark mode */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(10px) ${
                isPressed ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
              }`,
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              className={cn(
                'w-full h-[42px] m-[2px] rounded-full transition-all duration-300',
                isLight
                  ? 'bg-gradient-to-b from-white via-neutral-50 to-neutral-200 border border-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.06)]'
                  : 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
              )}
              style={{
                boxShadow: isPressed
                  ? isLight
                    ? 'inset 0px 2px 4px rgba(0, 0, 0, 0.15)'
                    : 'inset 0px 2px 4px rgba(0, 0, 0, 0.6)'
                  : undefined,
              }}
            />
          </div>

          {/* Shader Metallic Rim / Backdrop Plate */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(0px) ${
                isPressed ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
              }`,
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              className={cn(
                'h-[46px] w-full rounded-full transition-all duration-300',
                isPressed
                  ? 'shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.2)]'
                  : isHovered
                  ? isLight
                    ? 'shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_12px_24px_rgba(0,0,0,0.12),0_0_16px_rgba(0,0,0,0.08)]'
                    : 'shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_12px_24px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.15)]'
                  : isLight
                  ? 'shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.06)]'
                  : 'shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.3)]'
              )}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded w-full h-full rounded-full overflow-hidden relative opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Clickable HTML Button Surface */}
          <button
            ref={buttonRef}
            type={type}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            disabled={disabled || isLoading}
            className="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer outline-none z-40 rounded-full overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(25px)',
            }}
            aria-label={typeof displayLabel === 'string' ? displayLabel : label}
            {...props}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: 'absolute',
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isLight
                    ? 'radial-gradient(circle, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 70%)'
                    : 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
                  pointerEvents: 'none',
                  animation: 'ripple-animation 0.6s ease-out',
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiquidMetalButton;
