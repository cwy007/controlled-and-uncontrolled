import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";

function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T,
    value?: T
    onChange?: (value: T) => void;
  }
): [T, React.Dispatch<React.SetStateAction<T>>,] {
  const { defaultValue, value: propsValue, onChange } = props || {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState<T>(() => {
    // 通过判断 value 是不是 undefined 来区分受控模式和非受控模式
    if (propsValue !== undefined) {
      return propsValue!;
    } else if(defaultValue !== undefined){
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(() => {
    // 当不是首次渲染，但 value 变为 undefined 的情况，也就是从受控模式切换到了非受控模式，要同步设置 state 为 propsValue
    if(propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false;
  }, [propsValue]);

  // 如果是受控模式，useState 的初始值设置 props.value，然后渲染用 props.value。
  // 如果是非受控模式，那渲染用内部 state 的 value，然后 changeValue 里 setValue。
  const mergedValue = propsValue === undefined ? stateValue : propsValue;

  function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  }

  const setState = useCallback((value: SetStateAction<T>) => {
    let res = isFunction(value) ? value(stateValue) : value

    if (propsValue === undefined) {
      setStateValue(res);
    }
    onChange?.(res);
  }, [stateValue]);

  return [mergedValue, setState]
}

export default useMergeState;
