import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const PullToRefresh = ({ onRefresh, children }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [pullProgress, setPullProgress] = useState(0);
    const containerRef = useRef(null);
    const startY = useRef(0);
    const startX = useRef(0);
    const currentY = useRef(0);
    const pulling = useRef(false);
    const pullStartedAtTop = useRef(false);
    const distanceThreshold = 200;
    const minVerticalDistance = 50; // Minimum vertical distance before showing visual feedback
    const maxHorizontalRatio = 0.8; // Maximum allowed horizontal movement ratio

    // Helper function to check if we're at the top of the page
    const isAtTop = () => {
        return window.scrollY === 0; // Only true when exactly at top
    };

    useEffect(() => {
        let touchStartTime = 0;
        const touchStartDelay = 100; // ms delay before starting pull detection

        const handleTouchStart = (e) => {
            // Store the start position
            startY.current = e.touches[0].clientY;
            startX.current = e.touches[0].clientX;
            currentY.current = startY.current;

            // Record if we're at the top when touch starts
            pullStartedAtTop.current = isAtTop();

            // Set timestamp for possible delayed pull activation
            touchStartTime = Date.now();

            // Don't set pulling to true immediately
            pulling.current = false;
        };

        const handleTouchMove = (e) => {
            currentY.current = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;

            // Calculate vertical and horizontal distances
            const verticalDistance = currentY.current - startY.current;
            const horizontalDistance = Math.abs(currentX - startX.current);

            // Check if movement is mostly vertical (not horizontal/diagonal)
            const isVerticalMovement = horizontalDistance < verticalDistance * maxHorizontalRatio;

            // Only allow pull if: started at top, moving downward, and mostly vertical movement
            const canPull = pullStartedAtTop.current &&
                verticalDistance > minVerticalDistance &&
                isVerticalMovement;

            // If we have a horizontal drag, don't enable pulling
            if (horizontalDistance > 20 && horizontalDistance > verticalDistance) {
                pulling.current = false;
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0)';
                }
                return;
            }

            // Only enable pulling after delay and if conditions are met
            if (!pulling.current && canPull && Date.now() - touchStartTime > touchStartDelay) {
                pulling.current = true;
            }

            // If not pulling or not at top, exit
            if (!pulling.current) {
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0)';
                }
                return;
            }

            // Only show visual indicator when pulling down
            if (verticalDistance > 0 && pulling.current) {
                // Calculate progress as a percentage
                const newProgress = Math.min(1, verticalDistance / distanceThreshold);
                setPullProgress(newProgress);

                // Apply transformation to the container
                if (containerRef.current) {
                    // More resistance for longer pulls
                    const resistance = 2.5 + (verticalDistance / 200);
                    containerRef.current.style.transform = `translateY(${Math.min(verticalDistance / resistance, distanceThreshold)}px)`;
                }

                // If pulling significantly, prevent default to avoid system behaviors
                if (verticalDistance > 30) {
                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = async () => {
            if (!pulling.current) return;

            pulling.current = false;
            pullStartedAtTop.current = false;
            const pullDistance = currentY.current - startY.current;

            // Check if the pull was sufficient AND we're at the top
            if (pullDistance > distanceThreshold && isAtTop()) {
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

        // Scroll handler to disable pulling when user scrolls away from top
        const handleScroll = () => {
            if (!isAtTop()) {
                pullStartedAtTop.current = false;
                pulling.current = false;
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0)';
                }
            }
        };

        // Set up event listeners
        if (containerRef.current) {
            containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
            containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
            containerRef.current.addEventListener('touchend', handleTouchEnd);
            window.addEventListener('scroll', handleScroll);
        }

        // Clean up
        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('touchstart', handleTouchStart);
                containerRef.current.removeEventListener('touchmove', handleTouchMove);
                containerRef.current.removeEventListener('touchend', handleTouchEnd);
            }
            window.removeEventListener('scroll', handleScroll);
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
                    padding: '0',
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
                        padding: '0',
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