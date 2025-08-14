import { useState, useEffect, useRef } from "react";

const ClickAwayListener = ({children, onClickAway}) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickAway();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClickAway]);

  return <div ref={ref}>{children}</div>;
};

export default ClickAwayListener;
