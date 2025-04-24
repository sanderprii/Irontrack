import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Tooltip
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EmailIcon from '@mui/icons-material/Email';
import { analyticsApi } from '../api/analyticsApi';

import SendMessageModal from './SendMessageModal';

const NewMembersRetention = ({ affiliateId, affiliateEmail, period }) => {
    const [newMembers, setNewMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [periodLabel, setPeriodLabel] = useState('');
    const [messageModalOpen, setMessageModalOpen] = useState(false);

    useEffect(() => {
        loadNewMembers();
    }, [period, affiliateId]);

    const loadNewMembers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const result = await analyticsApi.getNewMembers(token, affiliateId, period);
            setNewMembers(result.data);
            setPeriodLabel(result.periodLabel);
        } catch (error) {
            console.error('Error loading new members:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleSendMessageClick = () => {
        setMessageModalOpen(true);
    };

    return (
        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2">
                    New Members Retention ({periodLabel})
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EmailIcon />}
                    onClick={handleSendMessageClick}
                    disabled={newMembers.length === 0}
                >
                    Send Message
                </Button>
            </Box>



            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                    <CircularProgress />
                </Box>
            ) : newMembers.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                    <Typography variant="body1" color="textSecondary">
                        No new members during this period.
                    </Typography>
                </Box>
            ) : (
                <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Member Name</TableCell>
                                <TableCell>Joined Date</TableCell>
                                <TableCell align="center">Active Plan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newMembers.map((member) => (
                                <TableRow key={member.userId} hover>
                                    <TableCell>{member.fullName}</TableCell>
                                    <TableCell>
                                        {new Date(member.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={member.hasActivePlan ? "Has active plan" : "No active plan"}>
                                            <FiberManualRecordIcon
                                                sx={{
                                                    color: member.hasActivePlan ? 'green' : 'red',
                                                    fontSize: 14
                                                }}
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Send Message Modal */}
            <SendMessageModal
                open={messageModalOpen}
                onClose={() => setMessageModalOpen(false)}
                affiliate={affiliateId}
                affiliateEmail={affiliateEmail}
                preSelectedUsers={newMembers.map(member => ({
                    id: member.userId,
                    fullName: member.fullName,
                    email: member.email
                }))}
            />
        </Paper>
    );
};

export default NewMembersRetention;