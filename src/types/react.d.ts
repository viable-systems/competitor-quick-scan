declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, (s: S) => void];
  export function useEffect(effect: () => void, deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export type FormEvent<T = any> = any;
  export type ReactNode = any;
  export type ComponentType<P = {}> = any;
  export type FC<P = {}> = any;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}
