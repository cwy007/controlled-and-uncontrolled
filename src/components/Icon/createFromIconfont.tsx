import React from 'react'
import Icon, { IconProps } from '.';

const loadedSet = new Set<string>();

const createFromIconfont = (scriptUrl: string) => {
  if (typeof scriptUrl === 'string' && scriptUrl.length && !loadedSet.has(scriptUrl)) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    document.body.appendChild(script);
    loadedSet.add(scriptUrl);
  }

  const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;

    return (
      <Icon ref={ref} aria-hidden="true" {...rest}>
        {type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  }
  );

  return Iconfont;
}

export default createFromIconfont