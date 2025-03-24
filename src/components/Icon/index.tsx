import classNames from 'classnames';
import React, { forwardRef, PropsWithChildren } from 'react'
import './index.scss';

type BaseIconProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: string | string[];
  spin?: boolean;
}

export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps['size']) => {
  if (Array.isArray(size) && size.length === 2) {
    return size;
  }
  const width = (size as string) || '1em';
  const height = (size as string) || "1em";

  return [width, height];
}

const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>((props, ref) => {
  const { className, style, size = '1em', spin, children, ...restProps } = props;
  const cls = classNames(
    'icon',
    {
      'icon-spin': spin,
    },
    className
  );

  const [width, height] = getSize(size);

  return (
    <svg className={cls} style={style} width={width} height={height} ref={ref} fill="currentColor" {...restProps}>
      {children}
    </svg>
  );
}
);

export default Icon;