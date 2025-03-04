import React, {useEffect, useState} from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import {getUserAttendees} from '../api/profileApi'; // Sinu olemasolev API-funktsioon

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
                setAttendances(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching visit history:', err);
                setAttendances([]);
            }
        };
        fetchData();
    }, [user]);

    // Klikkides reale: avab või sulgeb detailvaate
    const handleRowClick = (id) => {
        setOpenRow((prev) => (prev === id ? null : id));
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ml: 2}}>
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
                                            {isOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                        </TableCell>
                                        <TableCell>{classDate}</TableCell>
                                        <TableCell>{trainingType}</TableCell>
                                        <TableCell align="center">
                                            {hasLeaderboard && <EmojiEventsIcon color="primary"/>}
                                        </TableCell>
                                    </TableRow>

                                    {/* DETAILRIDA (kuvatakse, kui lahti) */}
                                    {isOpen && (
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{bgcolor: '#f5f5f5'}}>
                                                <Box sx={{p: 2}}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Class Details
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Name:</strong> {att.classSchedule?.trainingName}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{mb: 2}}>
                                                        <strong>Trainer:</strong> {att.classSchedule?.trainer}
                                                    </Typography>
                                                    {hasDescription && (
                                                        <>
                                                            <Typography variant="body2">
                                                                <strong>WOD Name:</strong> {att.classSchedule?.wodName}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Type:</strong> {att.classSchedule?.wodType}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Description:</strong> {att.classSchedule?.description}
                                                            </Typography>
                                                        </>
                                                    )}


                                                    {/* Leaderboard tulemused (kui on) */}
                                                    {hasLeaderboard && (
                                                        <>
                                                            <Typography variant="subtitle1">Your leaderboard
                                                                result:</Typography>
                                                            {att.leaderboard.map((lb) => (
                                                                <Box key={lb.id} sx={{ml: 2}}>
                                                                    <Typography variant="body2">
                                                                        <strong>Score:</strong> {lb.score}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <strong>{lb.scoreType}</strong> {lb.scoreType}
                                                                    </Typography>


                                                                </Box>
                                                            ))}
                                                        </>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
