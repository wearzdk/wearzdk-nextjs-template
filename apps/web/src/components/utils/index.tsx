import type {
  CaseProps,
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ForProps,
  MatchProps,
  ShowProps,
  SwitchProps,
} from '@/types/components';
import React, { Fragment, type ReactNode } from 'react';

// Show组件 - 条件渲染
export function Show<T>({
  children,
  when,
  fallback,
}: ShowProps<T>): React.ReactElement | ReactNode | null {
  function isNotNullOrUndefined(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

  if (!isNotNullOrUndefined(when) || !when) return fallback ?? null;
  return <>{children}</>;
}

// Match组件 - 多条件匹配渲染
export function Match<T>({ children, when, fallback }: MatchProps<T>) {
  return <>{when ? children : fallback}</>;
}

// For组件 - 循环渲染
export function For<T>({ each, children }: ForProps<T>): React.ReactElement {
  return (
    <>
      {each.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Fragment key={index}>{children(item, index)}</Fragment>
      ))}
    </>
  );
}

// Case组件 - Switch的子组件
export const Case: React.FC<CaseProps> = ({ when, children }) => {
  return when ? <>{children}</> : null;
};

// Switch组件 - 多分支条件渲染
export const Switch: React.FC<SwitchProps> = ({ children, fallback }) => {
  let matched = false;
  const childrenArray = React.Children.toArray(children);

  for (const child of childrenArray) {
    if (React.isValidElement<CaseProps>(child) && child.type === Case) {
      if (child.props.when && !matched) {
        matched = true;
        return child;
      }
    }
  }

  return <>{fallback}</>;
};

// ErrorBoundary组件 - 错误边界处理
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback(
        this.state.error ?? new Error('Unknown error'),
      );
    }
    return this.props.children;
  }
}
