import type { ReactElement, ReactNode } from 'react';

// 基础类型
export type BooleanLike = boolean | string | number | null | undefined;

// 通用的 Props 类型，支持函数式 children
export type CustomPropsWithChildren<P = object> = P & {
  children?: ReactNode | ((...args: unknown[]) => ReactNode);
};

// Show 组件类型
export interface ShowProps<T> {
  children: ReactNode;
  when: T | null | undefined;
  fallback?: ReactNode;
}

// Match 组件类型
export interface MatchProps<T> {
  children: ReactNode;
  when: T | undefined | null | false;
  fallback?: ReactNode;
}

// For 组件类型
export interface ForProps<T> {
  each: T[];
  children: (item: T, index: number) => ReactNode;
}

// Switch 和 Case 组件类型
export interface CaseProps {
  when: boolean;
  children: ReactNode;
}

export interface SwitchProps {
  children: ReactElement<CaseProps> | ReactElement<CaseProps>[];
  fallback?: ReactNode;
}

// ErrorBoundary 组件类型
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
