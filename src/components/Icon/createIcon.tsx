import React, { forwardRef } from 'react'
import Icon, { IconProps } from '.';

interface CreateIconProps {
  content: React.ReactNode;
  iconProps?: IconProps;
  viewBox?: string;
}

const createIcon = (options: CreateIconProps) => {
  const { content, iconProps = {}, viewBox = '0 0 1024 1024' } = options;

  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {

    return (
      <Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
        {content}
      </Icon>
    );
  }
  );
};

export default createIcon;
