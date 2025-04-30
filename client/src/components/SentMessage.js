// src/components/SentMessage.js
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
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Stack,
    CircularProgress,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getSentMessages } from '../api/messageApi';
import PullToRefresh from './PullToRefresh';

export default function SentMessage({ affiliate }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getSentMessages(affiliate, page, search);

            // Veendume, et andmed on õiges vormis


            setMessages(data.messages || []);
            if (data.pagination) {
                setTotalPages(data.pagination.pages || 1);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching sent messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [affiliate, page, search]);

    const handleRefresh = async () => {
        await fetchMessages();
    };

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Lähtestame laiendatud oleku lehte muutes
        setExpanded({});
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1); // Lähtestame otsides esimese lehekülje
    };

    // Funktsioon leheküljestamise kuvamiseks
    const renderPagination = () => {
        if (!pagination) return null;



        // Kui on ainult üks lehekülg, siis ei näita leheküljestamist
        if (totalPages <= 1) return null;

        // Arvutame näidatavate lehekülgede vahemiku
        const renderPageNumbers = () => {
            const delta = 2; // Mitu lehekülge näidatakse praeguse lehekülje mõlemal küljel
            const pages = [];
            let showLeftEllipsis = false;
            let showRightEllipsis = false;

            for (let i = 1; i <= totalPages; i++) {
                if (
                    i === 1 ||
                    i === totalPages ||
                    (i >= page - delta && i <= page + delta)
                ) {
                    pages.push(
                        <IconButton
                            key={i}
                            onClick={() => handlePageChange(i)}
                            sx={{
                                fontWeight: page === i ? 'bold' : 'normal',
                                color: page === i ? 'primary.main' : 'inherit',
                            }}
                        >
                            {i}
                        </IconButton>
                    );
                } else if (i < page - delta && !showLeftEllipsis) {
                    pages.push(<Typography key="left-ellipsis" sx={{ px: 1 }}>...</Typography>);
                    showLeftEllipsis = true;
                } else if (i > page + delta && !showRightEllipsis) {
                    pages.push(<Typography key="right-ellipsis" sx={{ px: 1 }}>...</Typography>);
                    showRightEllipsis = true;
                }
            }
            return pages;
        };

        return (
            <>
                <Divider sx={{ my: 2 }} />
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                    mb={2}
                    sx={{ width: '100%' }}
                >
                    <IconButton
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    {renderPageNumbers()}

                    <IconButton
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Stack>
            </>
        );
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div>
                <Typography variant="h5" gutterBottom>
                    Sent Messages
                </Typography>

                {/* Otsingu väli */}
                <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by recipient, subject or content"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton type="submit" edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Lehtede info */}
                {pagination && pagination.total > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Showing {(page - 1) * pagination.limit + 1} - {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} messages
                    </Typography>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography>No messages found</Typography>
                ) : (
                    <>
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

                        {/* Lehekülgede navigatsioon */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </PullToRefresh>
    );
}