import { useState, useEffect, useRef } from "react";

const ClickAwayListener = ({children, onClickAway, ignoreRefs=[]}) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (
			ref.current &&
			!ref.current.contains(event.target) &&
			!ignoreRefs.some(
				(r) => r.current && r.current.contains(event.target)
			)
      ) {
        console.log("Closed");
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
