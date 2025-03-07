'use client';
import { Suspense, lazy, useState, useEffect } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({
  scene,
  className,
  onLoad
}) {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSpline, setShowSpline] = useState(false);

  // Simulate loading progress with a minimum loading time
  useEffect(() => {
    let interval;
    let minLoadingTimer;
    
    if (loading) {
      let progress = 0;
      interval = setInterval(() => {
        progress += Math.random() * 5 + 2; // More consistent progress
        if (progress > 100) {
          progress = 100;
          clearInterval(interval);
        }
        setLoadingProgress(Math.min(progress, 100));
      }, 180);
      
      // Ensure loader is shown for at least 2 seconds
      minLoadingTimer = setTimeout(() => {
        setShowSpline(true);
      }, 2000);
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(minLoadingTimer);
    };
  }, [loading]);

  const handleSplineLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  return (
    <>
      {(!showSpline || loading) && (
        <div className="scene-loader-container">
          <div className="loader">
            {/* The pseudo-elements handle the spinner visuals */}
          </div>
          <div className="scene-loader-text">
            <span className="inline-block">
              Loading 3D Experience... {Math.round(loadingProgress)}%
            </span>
          </div>
        </div>
      )}
      
      {showSpline && (
        <Suspense fallback={null}>
          <div style={{ display: loading ? 'none' : 'block', width: '100%', height: '100%' }}>
            <Spline 
              scene={scene} 
              className={className} 
              onLoad={handleSplineLoad}
            />
          </div>
        </Suspense>
      )}
    </>
  );
}