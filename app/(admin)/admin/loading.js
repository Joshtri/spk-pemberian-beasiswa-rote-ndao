"use client"

import ThreeLoading from '@/components/three-loading'
import React, { useEffect, useState } from 'react'

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a timeout of 5 seconds (5000ms) before hiding the loading component
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return isVisible ? <ThreeLoading text={'test'} /> : null;
}
