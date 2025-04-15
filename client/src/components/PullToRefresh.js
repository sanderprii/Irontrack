import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const PullToRefresh = ({ onRefresh, children, disabled = false }) => {
    const [isPulling, setIsPulling] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const pullStartY = useRef(0);
    const pullMoveY = useRef(0);
    const distanceThreshold = 80; // pikslites - kui kaugele peab tõmbama, et värskendus käivituks
    const refreshIndicatorHeight = useRef(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const touchStart = (e) => {
            // Kui funktsioon on keelatud, siis väljume
            if (disabled) return;

            // Ainult kui oleme lehe ülaosas, siis lubame tõmbamist
            if (window.scrollY === 0) {
                pullStartY.current = e.touches[0].clientY;
                setIsPulling(true);
            }
        };

        const touchMove = (e) => {
            if (!isPulling || disabled) return;

            pullMoveY.current = e.touches[0].clientY;
            const pullDistance = pullMoveY.current - pullStartY.current;

            // Näitame visuaalset indikaatorit ainult kui tõmbame alla
            if (pullDistance > 0) {
                e.preventDefault(); // Takistame tavalist kerimist

                // Arvutame indikaatori kõrguse, kasutades valemit, mis muudab liikumise sujuvamaks
                refreshIndicatorHeight.current = Math.min(distanceThreshold, pullDistance * 0.5);

                if (containerRef.current) {
                    containerRef.current.style.transform = `translateY(${refreshIndicatorHeight.current}px)`;
                }
            }
        };

        const touchEnd = async () => {
            if (!isPulling || disabled) return;

            // Kui tõmbamise kaugus on piisav, käivitame värskenduse
            const pullDistance = pullMoveY.current - pullStartY.current;

            if (pullDistance > distanceThreshold) {
                setRefreshing(true);

                if (typeof onRefresh === 'function') {
                    try {
                        await onRefresh();
                    } catch (error) {
                        console.error('Värskendamine ebaõnnestus:', error);
                    }
                }
            }

            // Taastame algse oleku
            resetPullState();
        };

        const resetPullState = () => {
            setIsPulling(false);
            setRefreshing(false);
            pullStartY.current = 0;
            pullMoveY.current = 0;

            if (containerRef.current) {
                // Lisame siirde efekti, et animeerida tagasi algasendisse
                containerRef.current.style.transition = 'transform 0.3s ease-out';
                containerRef.current.style.transform = 'translateY(0)';

                // Eemaldame siirde pärast animatsiooni lõppu
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.transition = '';
                    }
                }, 300);
            }
        };

        // Lisame sündmuste kuularid
        document.addEventListener('touchstart', touchStart, { passive: false });
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('touchend', touchEnd);

        // Puhastame sündmuste kuularid, kui komponent eemaldatakse
        return () => {
            document.removeEventListener('touchstart', touchStart);
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('touchend', touchEnd);
        };
    }, [isPulling, onRefresh, disabled]);

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
            {/* Värskendamise indikaator */}
            <Box
                sx={{
                    height: refreshing ? `${distanceThreshold}px` : '0px',
                    opacity: refreshing ? 1 : (refreshIndicatorHeight.current / distanceThreshold),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: refreshing ? 'height 0.2s ease-out' : 'none',
                    overflow: 'hidden'
                }}
            >
                {refreshing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2">Värskendamine...</Typography>
                    </Box>
                ) : (
                    <Typography variant="body2">Tõmba alla, et värskendada</Typography>
                )}
            </Box>

            {/* Sisu konteiner */}
            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    height: '100%',
                    willChange: 'transform',
                    transition: refreshing ? 'transform 0.2s ease-out' : ''
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default PullToRefresh;