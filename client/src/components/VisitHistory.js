import React, {useEffect, useState} from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Collapse,
    Card,
    CardContent,
    Divider,
    Chip,
    Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';

import {getUserAttendees} from '../api/profileApi';
import DOMPurify from "dompurify"; // Sinu olemasolev API-funktsioon

/**
 * Abifunktsioon: kuupäeva formindamine (dd.MM.yyyy, nt 21.02.2025)
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
}

/**
 * VisitHistory - mitte-modal komponendi näide
 *
 * Kuvab tabelis kasutaja külastused (`classAttendee`+`classSchedule`+`leaderboard`)
 * kindla affiliate'i raames. Reale klikkides avaneb detailne vaade:
 * - Class detailid (name, wodName, description, trainer)
 * - Kasutaja leaderboard-tulemused (kui on).
 */
export default function VisitHistory({user, affiliateId}) {
    const [attendances, setAttendances] = useState([]);
    const [openRow, setOpenRow] = useState(null); // hoiab classAttendee.id, mille detailid on lahti

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.id) return;
            try {
                // Kasutame sinu profiili-API funktsiooni getUserAttendees(affiliateId, userId)
                const data = await getUserAttendees(affiliateId, user.id);

                // Sorteeri tulemus uuemast vanemaks
                const sortedData = Array.isArray(data)
                    ? data.sort((a, b) => {
                        const dateA = a.classSchedule?.time ? new Date(a.classSchedule.time) : new Date(0);
                        const dateB = b.classSchedule?.time ? new Date(b.classSchedule.time) : new Date(0);
                        return dateB - dateA; // Tagurpidi järjestus (uuemad eespool)
                    })
                    : [];

                setAttendances(sortedData);
            } catch (err) {
                console.error('Error fetching visit history:', err);
                setAttendances([]);
            }
        };
        fetchData();
    }, [user, affiliateId]);

    // Klikkides reale: avab või sulgeb detailvaate
    const handleRowClick = (id) => {
        setOpenRow((prev) => (prev === id ? null : id));
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ml: 2, fontWeight: 'bold'}}>
                Visit History
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={50}></TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Training Type</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendances.map((att) => {
                            // 'att' on üks classAttendee, mis sisaldab classSchedule + leaderboard
                            const id = att.id;
                            const isOpen = openRow === id;

                            // Kuupäev - eeldame, et 'att.classSchedule.time' on treeningu algusaeg
                            const classDate = formatDate(att.classSchedule?.time);

                            // Treeningu tüüp
                            const trainingType = att.classSchedule?.trainingType || '-';

                            // Kui on vähemalt üks leaderboard kirje, kuvame trofee
                            const hasLeaderboard =
                                Array.isArray(att.leaderboard) && att.leaderboard.length > 0;

                            const hasDescription = att.classSchedule?.description;

                            return (
                                <React.Fragment key={id}>
                                    {/* PÕHIRIDA */}
                                    <TableRow
                                        hover
                                        onClick={() => handleRowClick(id)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <TableCell>
                                            <IconButton size="small">
                                                {isOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{classDate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={trainingType}
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {hasLeaderboard && <EmojiEventsIcon color="primary"/>}
                                        </TableCell>
                                    </TableRow>

                                    {/* DETAILRIDA (kuvatakse, kui lahti) */}
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                        Class Details
                                                    </Typography>

                                                    <Grid container spacing={3}>
                                                        {/* Class Information Card */}
                                                        <Grid item xs={12} md={6}>
                                                            <Card elevation={1} sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <FitnessCenterIcon sx={{ mr: 1 }} />
                                                                        Class Information
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        {att.familyMemberName && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                    Family Member:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {att.familyMemberName}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                Name:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {att.classSchedule?.trainingName || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                Trainer:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {att.classSchedule?.trainer || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                Date:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {classDate}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                Type:
                                                                            </Typography>
                                                                            <Chip
                                                                                label={trainingType}
                                                                                color="primary"
                                                                                size="small"
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        {/* Workout Information Card - if has description */}
                                                        {hasDescription && (
                                                            <Grid item xs={12} md={6}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <WhatshotIcon sx={{ mr: 1 }} />
                                                                            Workout Details
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                    WOD Name:
                                                                                </Typography>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#e74c3c' }}>
                                                                                    {att.classSchedule?.wodName || "None"}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 120 }}>
                                                                                    WOD Type:
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={att.classSchedule?.wodType || "None"}
                                                                                    color="secondary"
                                                                                    size="small"
                                                                                />
                                                                            </Box>
                                                                        </Box>

                                                                        <Box sx={{ mt: 2 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                                                Description:
                                                                            </Typography>
                                                                            <Box
                                                                                sx={{
                                                                                    backgroundColor: '#f8f9fa',
                                                                                    p: 2,
                                                                                    borderRadius: 1,
                                                                                }}
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: DOMPurify.sanitize(att.classSchedule?.description || "No description available", {
                                                                                        ALLOWED_TAGS: ['b', 'i', 'span'],
                                                                                        ALLOWED_ATTR: ['style'],
                                                                                    })
                                                                                }}
                                                                            />

                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        )}

                                                        {/* Leaderboard Results Card - if has leaderboard */}
                                                        {hasLeaderboard && (
                                                            <Grid item xs={12}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <EmojiEventsIcon sx={{ mr: 1 }} />
                                                                            Leaderboard Results
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Grid container spacing={2}>
                                                                            {att.leaderboard.map((lb) => (
                                                                                <Grid item xs={12} md={6} key={lb.id}>
                                                                                    <Card elevation={0} sx={{
                                                                                        backgroundColor: '#f8f9fa',
                                                                                        border: '1px solid #e9ecef',
                                                                                        borderRadius: 1
                                                                                    }}>
                                                                                        <CardContent>
                                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                                                    {lb.scoreType.toUpperCase()}
                                                                                                </Typography>
                                                                                                <Chip
                                                                                                    label={lb.score}
                                                                                                    color="success"
                                                                                                    sx={{ fontWeight: 'bold' }}
                                                                                                />
                                                                                            </Box>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                </Grid>
                                                                            ))}
                                                                        </Grid>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}