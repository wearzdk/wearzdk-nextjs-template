import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@ui/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const handleRipple = React.useCallback(
      (
        event:
          | React.MouseEvent<HTMLButtonElement>
          | React.TouchEvent<HTMLButtonElement>,
      ) => {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        let x: number;
        let y: number;

        if ('touches' in event) {
          // 触摸事件
          const touch = event.touches[0];
          if (!touch) return; // 如果没有触摸点，直接返回
          const rect = button.getBoundingClientRect();
          x = touch.clientX - rect.left - radius;
          y = touch.clientY - rect.top - radius;
        } else {
          // 鼠标事件
          const rect = button.getBoundingClientRect();
          x = event.clientX - rect.left - radius;
          y = event.clientY - rect.top - radius;
        }

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circle.classList.add('ripple-span');

        const rippleColor = 'rgb(255, 255, 255)';
        const opacity =
          variant === 'ghost' || variant === 'link' || variant === 'outline'
            ? '0.15' // 浅色背景按钮
            : '0.35'; // 深色背景按钮

        circle.style.backgroundColor = rippleColor;
        circle.style.opacity = opacity;

        const existingRipple = button.getElementsByClassName('ripple-span')[0];
        if (existingRipple) {
          existingRipple.remove();
        }

        button.appendChild(circle);

        // 在鼠标抬起或触摸结束时移除涟漪
        const handleRelease = () => {
          if (circle.parentElement === button) {
            circle.style.transition = 'opacity 0.2s ease-out';
            circle.style.opacity = '0';
            setTimeout(() => {
              circle.remove();
            }, 200);
          }
        };

        window.addEventListener('mouseup', handleRelease, { once: true });
        window.addEventListener('touchend', handleRelease, { once: true });
      },
      [variant],
    );

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          'relative overflow-hidden',
        )}
        ref={ref}
        onMouseDown={handleRipple}
        onTouchStart={handleRipple}
        onClick={onClick}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
