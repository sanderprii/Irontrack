import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const PullToRefresh = ({ onRefresh, children, disabled = false }) => {
    const [isPulling, setIsPulling] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const pullStartY = useRef(0);
    const pullMoveY = useRef(0);
    const distanceThreshold = 80; // pikslites - kui kaugele peab tõmbama
    const refreshIndicatorHeight = useRef(0);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    // PWA tuvastus - kas rakendus töötab standalone režiimis
    const isPWA = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.navigator.standalone === true;
    };

    useEffect(() => {
        // Määrame eraldi puutetundliku sündmuse kuulari PWA jaoks
        const setupPwaListeners = () => {
            if (contentRef.current) {
                contentRef.current.addEventListener('touchstart', touchStart, { passive: true });
                contentRef.current.addEventListener('touchmove', touchMove, { passive: false });
                contentRef.current.addEventListener('touchend', touchEnd);
            }
        };

        // PWA-spetsiifiline aktiveerimine, kui kontainer on laaditud
        if (isPWA()) {
            setupPwaListeners();

            // PWA-s on oluline, et kogu scroll konteineri ümber oleks õigesti käsitletud
            document.body.style.overscrollBehavior = 'none';
            document.documentElement.style.overscrollBehavior = 'none';
        }

        // Puhastame lisatud stiilid ja sündmused
        return () => {
            if (isPWA() && contentRef.current) {
                contentRef.current.removeEventListener('touchstart', touchStart);
                contentRef.current.removeEventListener('touchmove', touchMove);
                contentRef.current.removeEventListener('touchend', touchEnd);
            }
        };
    }, []);

    // Puutetundlikud sündmused
    const touchStart = (e) => {
        if (disabled) return;

        // Kontrollime, kas oleme lehe ülaosas (arvestades tolerantsi)
        const isAtTop =
            window.scrollY <= 5 ||
            (contentRef.current && contentRef.current.scrollTop <= 5);

        if (isAtTop) {
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
            // PWA režiimis peame aktiivselt takistama tavalist kerimist
            if (isPWA()) {
                e.preventDefault();
            } else {
                // Tavaliselt kontrollime, kas oleme lehe ülaosas
                const isAtTop =
                    window.scrollY <= 5 ||
                    (contentRef.current && contentRef.current.scrollTop <= 5);

                if (isAtTop) {
                    e.preventDefault();
                }
            }

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

    // Lisame dokumendi sündmuste kuularid tavalise brauseri jaoks (mitte-PWA)
    useEffect(() => {
        if (isPWA()) return; // PWA-s kasutame teisi kuulareid

        // Standardsed sündmuste kuularid
        document.addEventListener('touchstart', touchStart, { passive: true });
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('touchend', touchEnd);

        // Puhastame sündmuste kuularid
        return () => {
            document.removeEventListener('touchstart', touchStart);
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('touchend', touchEnd);
        };
    }, [isPulling, disabled]);

    // Kontrollime puutetundlikku seadet
    const isTouchDevice = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

    // Kui pole puutetundlik seade, tagastame lihtsalt lapsed
    if (!isTouchDevice && !isPWA()) {
        return <>{children}</>;
    }

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Värskendamise indikaator */}
            <Box
                sx={{
                    height: refreshing ? `${distanceThreshold}px` : '0px',
                    opacity: refreshing ? 1 : (refreshIndicatorHeight.current / distanceThreshold),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: refreshing ? 'height 0.2s ease-out' : 'none',
                    overflow: 'hidden',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000
                }}
            >
                {refreshing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4px 12px', borderRadius: '16px' }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2">Värskendamine...</Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4px 12px', borderRadius: '16px' }}>
                        Tõmba alla, et värskendada
                    </Typography>
                )}
            </Box>

            {/* Sisu konteiner */}
            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    height: '100%',
                    willChange: 'transform',
                    transition: refreshing ? 'transform 0.2s ease-out' : '',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Sisu ref lisamine */}
                <Box ref={contentRef} sx={{ width: '100%', height: '100%' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default PullToRefresh;