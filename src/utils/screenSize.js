// useScreenSize.js
import { useState } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return screenSize;
};

export default useScreenSize;