import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const PullToRefresh = ({ onRefresh, children }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [pullProgress, setPullProgress] = useState(0);
    const containerRef = useRef(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const pulling = useRef(false);
    const distanceThreshold = 110;

    useEffect(() => {
        const handleTouchStart = (e) => {
            // Only start pulling if we're at the top of the page
            if (window.scrollY <= 5) {
                startY.current = e.touches[0].clientY;
                currentY.current = startY.current;
                pulling.current = true;
            }
        };

        const handleTouchMove = (e) => {
            if (!pulling.current) return;

            currentY.current = e.touches[0].clientY;
            const pullDistance = currentY.current - startY.current;

            // Only show visual indicator when pulling down
            if (pullDistance > 0 && window.scrollY <= 5) {
                // Calculate progress as a percentage
                const newProgress = Math.min(1, pullDistance / distanceThreshold);
                setPullProgress(newProgress);

                // Apply transformation to the container
                if (containerRef.current) {
                    containerRef.current.style.transform = `translateY(${Math.min(pullDistance / 2.5, distanceThreshold)}px)`;
                }

                // If pulling significantly, prevent default to avoid system behaviors
                if (pullDistance > 10) {
                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = async () => {
            if (!pulling.current) return;

            pulling.current = false;
            const pullDistance = currentY.current - startY.current;

            // Check if the pull was sufficient
            if (pullDistance > distanceThreshold && window.scrollY <= 5) {
                setRefreshing(true);

                try {
                    // Call the refresh function
                    if (typeof onRefresh === 'function') {
                        await onRefresh();
                    }
                } catch (error) {
                    console.error('Refresh failed:', error);
                } finally {
                    setRefreshing(false);
                }
            }

            // Reset to initial state
            setPullProgress(0);
            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 0.3s ease-out';
                containerRef.current.style.transform = 'translateY(0)';

                // Remove transition after animation completes
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.transition = '';
                    }
                }, 300);
            }
        };

        // Set up event listeners
        if (containerRef.current) {
            containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
            containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
            containerRef.current.addEventListener('touchend', handleTouchEnd);
        }

        // Clean up
        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('touchstart', handleTouchStart);
                containerRef.current.removeEventListener('touchmove', handleTouchMove);
                containerRef.current.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [onRefresh]);

    return (
        <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
            {/* Pull indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '8px 0',
                    opacity: refreshing ? 1 : pullProgress,
                    pointerEvents: 'none',
                    zIndex: 1000
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                >
                    {refreshing ? (
                        <>
                            <CircularProgress size={16} />
                            <Typography variant="caption">Refreshing...</Typography>
                        </>
                    ) : (
                        <Typography variant="caption">
                            {pullProgress >= 1 ? 'Release to refresh' : 'Pull down to refresh'}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Content */}
            {children}
        </Box>
    );
};

export default PullToRefresh;