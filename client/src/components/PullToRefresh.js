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
    const startScrollPosition = useRef(0); // Lisa scroll position jälgimine
    const distanceThreshold = 200;
    const minVerticalDistance = 50;
    const maxHorizontalRatio = 0.8;

    // Helper function to check if we're at the top of the page
    const isAtTop = () => {
        return window.scrollY <= 5; // Lisa väike tolerants (5px)
    };

    useEffect(() => {
        let touchStartTime = 0;
        const touchStartDelay = 100;

        const handleTouchStart = (e) => {
            startY.current = e.touches[0].clientY;
            startX.current = e.touches[0].clientX;
            currentY.current = startY.current;

            // Salvesta ka algne scroll positsioon
            startScrollPosition.current = window.scrollY;

            // Kontrolli kas alustasime ülevalt
            pullStartedAtTop.current = isAtTop();

            touchStartTime = Date.now();
            pulling.current = false;
        };

        const handleTouchMove = (e) => {
            currentY.current = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;

            const verticalDistance = currentY.current - startY.current;
            const horizontalDistance = Math.abs(currentX - startX.current);

            // Kui scrollisime allapoole pärast touch start, lõpeta pulling
            if (window.scrollY > startScrollPosition.current + 10) {
                pulling.current = false;
                pullStartedAtTop.current = false;
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0)';
                }
                return;
            }

            const isVerticalMovement = horizontalDistance < verticalDistance * maxHorizontalRatio;

            // Rangem kontroll - pead alustama ülevalt JA olema endiselt ülaossa lähedal
            const canPull = pullStartedAtTop.current &&
                verticalDistance > minVerticalDistance &&
                isVerticalMovement &&
                window.scrollY <= 10; // Lisa extra kontroll praeguse positsiooni jaoks

            // Horisontaalne liigutus - lõpeta pulling
            if (horizontalDistance > 20 && horizontalDistance > verticalDistance) {
                pulling.current = false;
                pullStartedAtTop.current = false;
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0)';
                }
                return;
            }

            // Aktiveeri pulling ainult pärast delay ja kui tingimused on täidetud
            if (!pulling.current && canPull && Date.now() - touchStartTime > touchStartDelay) {
                pulling.current = true;
            }

            // Kui ei pulling või pole õiges kohas, resetida
            if (!pulling.current || !pullStartedAtTop.current) {
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0)';
                }
                return;
            }

            // Näita ainult kui tõmmume alla ja pulling on aktiivne
            if (verticalDistance > 0 && pulling.current) {
                const newProgress = Math.min(1, verticalDistance / distanceThreshold);
                setPullProgress(newProgress);

                if (containerRef.current) {
                    const resistance = 2.5 + (verticalDistance / 200);
                    containerRef.current.style.transform = `translateY(${Math.min(verticalDistance / resistance, distanceThreshold)}px)`;
                }

                if (verticalDistance > 30) {
                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = async () => {
            if (!pulling.current || !pullStartedAtTop.current) {
                // Resetida kõik kui ei olnud proper pulling
                pulling.current = false;
                pullStartedAtTop.current = false;
                setPullProgress(0);
                if (containerRef.current) {
                    containerRef.current.style.transition = 'transform 0.3s ease-out';
                    containerRef.current.style.transform = 'translateY(0)';
                    setTimeout(() => {
                        if (containerRef.current) {
                            containerRef.current.style.transition = '';
                        }
                    }, 300);
                }
                return;
            }

            pulling.current = false;
            const pullDistance = currentY.current - startY.current;

            // Refresh ainult kui tõmbasime küllaldaselt JA alustasime ülevalt
            // Enam ei kontrolli praegust positsiooni, ainult seda kas alustasime ülevalt
            if (pullDistance > distanceThreshold && pullStartedAtTop.current) {
                setRefreshing(true);

                try {
                    if (typeof onRefresh === 'function') {
                        await onRefresh();
                    }
                } catch (error) {
                    console.error('Refresh failed:', error);
                } finally {
                    setRefreshing(false);
                }
            }

            // Reset kõik
            pullStartedAtTop.current = false;
            setPullProgress(0);
            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 0.3s ease-out';
                containerRef.current.style.transform = 'translateY(0)';

                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.transition = '';
                    }
                }, 300);
            }
        };

        // Scroll handler - olulisem kui enne
        const handleScroll = () => {
            // Kui scrollime kaugemale, lõpeta pulling
            if (window.scrollY > 15) { // 15px tolerants
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
            window.addEventListener('scroll', handleScroll, { passive: true });
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
                        padding: '8px 12px',
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