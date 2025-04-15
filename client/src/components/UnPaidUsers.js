import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Collapse,
    IconButton,
    Card,
    CardContent,
    Grid,
    Chip,
    CircularProgress,
    Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import { getUnpaidUsers } from '../api/contractApi';

// Row component for each unpaid user
const UnpaidUserRow = ({ row }) => {
    const [open, setOpen] = useState(false);

    // Check if payment is overdue (current day is greater than contract payment day)
    const currentDay = new Date().getDate();
    const isOverdue = row.contract && row.contract.paymentDay && currentDay > row.contract.paymentDay;

    return (
        <>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    backgroundColor: isOverdue ? '#ffdddd' : 'inherit',
                    '&:hover': { backgroundColor: isOverdue ? '#ffcccc' : '#f5f5f5' },
                    cursor: 'pointer'
                }}
                onClick={() => setOpen(!open)}
            >

                <TableCell>{row.user?.fullName || 'N/A'}</TableCell>
                <TableCell>{row.amount} €</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                    <Chip
                        label="Pending"
                        color="warning"
                        size="small"
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Detailed Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card elevation={1} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                User Information
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                    Name:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {row.user?.fullName || 'N/A'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <EmailIcon fontSize="small" sx={{ mr: 1, color: '#3498db' }} />
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                    Email:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {row.user?.email || 'N/A'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PhoneIcon fontSize="small" sx={{ mr: 1, color: '#3498db' }} />
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                    Phone:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {row.user?.phone || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card elevation={1} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                <DescriptionIcon sx={{ mr: 1 }} />
                                                Contract Details
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            {row.contract ? (
                                                <>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Contract Type:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {row.contract.contractType || 'N/A'}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <PaymentIcon fontSize="small" sx={{ mr: 1, color: '#2ecc71' }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Amount:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {row.contract.paymentAmount} €
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <EventIcon fontSize="small" sx={{ mr: 1, color: '#e74c3c' }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Payment Day:
                                                        </Typography>
                                                        <Typography variant="body1" sx={{
                                                            color: isOverdue ? '#e74c3c' : 'inherit',
                                                            fontWeight: isOverdue ? 'bold' : 'normal'
                                                        }}>
                                                            {row.contract.paymentDay}
                                                            {isOverdue && " (overdue)"}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Status:
                                                        </Typography>
                                                        <Chip
                                                            label={row.contract.status}
                                                            color={row.contract.status === "accepted" ? "success" : "default"}
                                                            size="small"
                                                        />
                                                    </Box>
                                                </>
                                            ) : (
                                                <Typography variant="body1">
                                                    No contract information available
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12}>
                                    <Card elevation={1}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                <PaymentIcon sx={{ mr: 1 }} />
                                                Transaction Details
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Amount:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {row.amount} €
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Invoice Number:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {row.invoiceNumber || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Payment link sended:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {new Date(row.createdAt).toLocaleString()}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            Status:
                                                        </Typography>
                                                        <Chip
                                                            label={row.status}
                                                            color="warning"
                                                            size="small"
                                                        />
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                            Description:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {row.description || 'No description available'}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

// Main component
export default function UnpaidUsers({affiliate}) {
    const [unpaidUsers, setUnpaidUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (affiliate && affiliate.id) {
            fetchUnpaidUsers();
        }
    }, [affiliate]);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, unpaidUsers]);

    const fetchUnpaidUsers = async () => {
        setLoading(true);
        try {
            // Fetch all unpaid users without search parameter
            const data = await getUnpaidUsers(affiliate.id);
            setUnpaidUsers(data);
            setFilteredUsers(data); // Initial list without filtering
        } catch (error) {
            console.error('Failed to fetch unpaid users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtering is now done in the frontend
    const filterUsers = () => {
        if (!searchTerm.trim()) {
            setFilteredUsers(unpaidUsers);
            return;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();
        const filtered = unpaidUsers.filter(item =>
            item.user?.fullName?.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredUsers(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Filtering happens automatically via useEffect
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Unpaid Users
            </Typography>

            <Box sx={{ mb: 3 }}>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ backgroundColor: 'white' }}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                    <Table aria-label="unpaid users table">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>

                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((row) => (
                                    <UnpaidUserRow key={row.id} row={row} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        {searchTerm ? 'No users matching your search' : 'No unpaid users found'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}