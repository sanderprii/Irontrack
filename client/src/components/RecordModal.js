import React, { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    useMediaQuery,
    useTheme,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
    LabelList
} from 'recharts';

const RecordModal = ({ open, onClose, recordType, recordName }) => {
    const [allRecords, setAllRecords] = useState([]);

    // Kas ekraani laius on väiksem kui "sm" breakpoint?
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Mobiilis kuvame 3 kirjet, suurel ekraanil 10
    const sliceAmount = isMobile ? 3 : 10;

    // See indeks määrab, millist vahemikku kuvame
    // startIndex ... (startIndex + sliceAmount - 1)
    const [startIndex, setStartIndex] = useState(0);

    // Laeme KÕIK sama 'recordName' kirjed (vanemad -> uuemad me sortime hiljem)
    const loadAllRecords = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${baseUrl}/records/${encodeURIComponent(recordName)}?type=${recordType}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Error fetching records by name');
            }
            const data = await response.json();
            setAllRecords(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Iga kord, kui modal avatakse (ja name on olemas), laeme kirjed
    useEffect(() => {
        if (open && recordName) {
            loadAllRecords();
        }
        // eslint-disable-next-line
    }, [open, recordName]);

    // Kui allRecords uuenevad, siis vaikimisi kuvame “kõige uuemad” (parempoolsed)
    // st paneme startIndex nii, et ekraanile tuleks just need sliceAmount uuemat
    useEffect(() => {
        if (!allRecords || allRecords.length === 0) {
            setStartIndex(0);
            return;
        }

        // Sortime (vanim -> uuem) allpool chartData’s,
        // aga siin teame lengthi, seega:
        const total = allRecords.length;
        const desiredStart = total - sliceAmount;
        const clampedStart = desiredStart < 0 ? 0 : desiredStart;
        setStartIndex(clampedStart);
    }, [allRecords, sliceAmount]);

    // Rekordi kustutamine punktile klikkides
    const handleDeleteRecord = async (recordId) => {
        try {
            const confirmDelete = window.confirm('Do you want to delete this record?');
            if (!confirmDelete) return;

            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${baseUrl}/records/${recordId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete record');
            }
            // Peale kustutamist laeme uuesti
            loadAllRecords();
        } catch (err) {
            console.error(err);
        }
    };

    // X-telje kuupäev 'MM/YY'
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = d.getFullYear().toString().slice(-2); // 2025 -> '25'
        return `${mm}/${yy}`;
    };

    // Klikk graafikul -> kustutamine
    const handleChartClick = (state) => {
        if (state && state.activePayload) {
            const { payload } = state.activePayload[0] || {};
            if (payload && payload.id) {
                handleDeleteRecord(payload.id);
            }
        }
    };

    // chartData on sortitud (vanim -> uuem),
    // sees on id, date, value (float), displayValue (algne sisestus)
    const chartData = useMemo(() => {
        if (!allRecords || allRecords.length === 0) return [];

        // Sort vanem -> uuem
        const sorted = [...allRecords].sort((a, b) => new Date(a.date) - new Date(b.date));

        return sorted.map((r) => {
            let rawValue = '';
            if (recordType === 'Cardio') {
                rawValue = r.time || '';
            } else if (recordType === 'Weightlifting') {
                rawValue = r.weight != null ? String(r.weight) : '';
            } else {
                // WOD
                rawValue = r.score || '';
            }

            // Asendame ':' '.'-ga, et parseFloat töötaks Y-teljel
            const parseString = rawValue.includes(':')
                ? rawValue.replace(':', '.')
                : rawValue;

            const floatVal = parseFloat(parseString) || 0;

            return {
                id: r.id,
                date: formatDate(r.date), // X telg
                value: floatVal,          // Y telg
                displayValue: rawValue    // punkti kohal silt
            };
        });
    }, [allRecords, recordType]);

    // Määrame praeguse lõppindeksi
    const endIndex = startIndex + sliceAmount;
    // Lõikame sellest vahemikust välja
    const showData = chartData.slice(startIndex, endIndex);

    // Kas on vanemaid kirjeid (st kas startIndex > 0?)
    const hasOlder = startIndex > 0;
    // Kas on uuemaid kirjeid (st kas endIndex < chartData.length?)
    const hasNewer = endIndex < chartData.length;

    // Nupu "Show older" -> nihutame startIndex sliceAmount võrra vasakule (vanemasse)
    const handleShowOlder = () => {
        setStartIndex((prev) => Math.max(0, prev - sliceAmount));
    };

    // Nupu "Show newer" -> nihutame startIndex sliceAmount võrra paremale (uuemasse)
    const handleShowNewer = () => {
        setStartIndex((prev) => Math.min(chartData.length - sliceAmount, prev + sliceAmount));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                All results for: {recordName}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {showData.length === 0 ? (
                    <p>No data found.</p>
                ) : (
                    <>
                        <Box sx={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={showData}
                                    margin={{ top: 60, right: 20, bottom: 30 }}
                                    onClick={handleChartClick}

                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <ReferenceLine y={0} stroke="#000" />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#1976d2"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                        isAnimationActive={false}
                                    >
                                        <LabelList dataKey="displayValue" position="top" offset={10} />
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>

                        {/* Nupud vanemate / uuemate kuvamiseks */}
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            {/* Kui on vanemaid andmeid, näitame "Show older" */}
                            {hasOlder ? (
                                <Button variant="contained" onClick={handleShowOlder}>
                                    Show older
                                </Button>
                            ) : (
                                <span /> // tühi täide, et nuppude read sätiks
                            )}

                            {/* Kui on uuemaid andmeid, näitame "Show newer" */}
                            {hasNewer ? (
                                <Button variant="contained" onClick={handleShowNewer}>
                                    Show newer
                                </Button>
                            ) : (
                                <span />
                            )}
                        </Box>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecordModal;
