// src/components/MessageComponents/SentMessage.js
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    Box
} from '@mui/material';
import { getSentMessages } from '../api/messageApi'; // Eeldame, et selline funktsioon on olemas

export default function SentMessage({ affiliate }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({}); // Olukord iga sõnumi jaoks, kas laienenud või mitte

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getSentMessages(affiliate);
                setMessages(data || []);
            } catch (error) {
                console.error('Error fetching sent messages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [affiliate]);

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Sent Messages
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Recipient Type</TableCell>
                                <TableCell>Recipient</TableCell>
                                <TableCell>Subject</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.map((msg) => {
                                const dateStr = new Date(msg.createdAt).toLocaleDateString('et-EE');
                                const recipientLabel = msg.recipientFullName || msg.groupName || 'Unknown';

                                return (
                                    <React.Fragment key={msg.id}>
                                        <TableRow
                                            onClick={() => toggleExpand(msg.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>{dateStr}</TableCell>
                                            <TableCell>{msg.recipientType}</TableCell>
                                            <TableCell>{recipientLabel}</TableCell>
                                            <TableCell>{msg.subject}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                                <Collapse in={expanded[msg.id]} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.body}</Typography>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
