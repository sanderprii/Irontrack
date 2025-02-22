import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Collapse,
    Paper,
    Grid, IconButton,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {getContracts, deleteContract, updateContract} from '../api/contractApi';
import CreateContract from './CreateContract';
import AddDefaultContractModal from './AddDefaultContractModal';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {updatePaymentHoliday} from "../api/contractApi";

export default function AffiliateContracts({affiliateId}) {
    const [contracts, setContracts] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Avatud read lepingu detailide kuvamiseks
    const [openRows, setOpenRows] = useState({});

    // Modali state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [defaultModalOpen, setDefaultModalOpen] = useState(false);

    useEffect(() => {
        loadContracts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, sortBy, sortOrder]);

    const loadContracts = async () => {
        // Tagastab affiliate lepingud, arvestades search ja sort
        const data = await getContracts(search, sortBy, sortOrder, affiliateId);
        if (Array.isArray(data)) {
            let sortedData = [...data];

            // Kui otsing on aktiivne, too vastavad nimed ette
            if (search.length > 0 && sortBy === "fullName") {
                sortedData.sort((a, b) => {
                    const nameA = a.user.fullName.toLowerCase();
                    const nameB = b.user.fullName.toLowerCase();
                    const searchTerm = search.toLowerCase();

                    // Kontrollime, kas nimi sisaldab otsitud terminit
                    const startsWithA = nameA.startsWith(searchTerm) ? -1 : 1;
                    const startsWithB = nameB.startsWith(searchTerm) ? -1 : 1;

                    // Kui mõlemad algavad otsinguterminiga, sorteeri tähestikuliselt
                    if (nameA.includes(searchTerm) && nameB.includes(searchTerm)) {
                        return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                    }

                    // Too nimed, mis algavad otsinguterminiga, ettepoole
                    return startsWithA - startsWithB;
                });
            }

            setContracts(sortedData);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);



        if (search.length > 0) {
            setSortBy("fullName"); // Kui on midagi sisestatud, sorteeri täisnime järgi
        } else {
            setSortBy("createdAt"); // Kui otsing on tühi, kasuta vaikimisi sortimist
        }

    };

    const handleSort = (field) => {
        if (sortBy === field) {
            // Vaheta suund
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleStatusColor = (status) => {
        switch (status) {
            case 'Waiting for acceptance':
                return 'orange';
            case 'accepted':
                return 'green';
            case 'Rejected':
                return 'red';

            case 'draft':
                return 'blue';
            default:
                return 'black';
        }
    }

    const handleUpdate = async (contract) => {
        // Kui leping on juba 'sent', ei uuenda
        if (contract.status === 'Waiting for acceptance') {
            alert('Contract is already sent');
            return;
        }

        const payload = {
            status: 'Waiting for acceptance',
        };
        await updateContract(contract.id, payload);
        loadContracts();
    };

    const toggleRow = (id) => {
        setOpenRows((prev) => ({...prev, [id]: !prev[id]}));
    };

    // PaymentHoliday uuendamise handler (kui affiliate klikkab Approved/Declined)
    const handleUpdatePhStatus = async (phId, newStatus) => {
        try {
            const result = await updatePaymentHoliday(phId, { accepted: newStatus });
            if (result && result.success) {
                alert(`Payment holiday set to "${newStatus}" successfully!`);
                await loadContracts();
            } else {
                alert('Error updating payment holiday status!');
            }
        } catch (error) {
            console.error('Error updating payment holiday:', error);
            alert('Error updating payment holiday!');
        }
    };



    return (
        <Box>
            {/* Pealkiri + nupud */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                    Contracts
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setCreateModalOpen(true)}
                        sx={{mr: 2}}
                    >
                        Add Contract
                    </Button>
                    <Button variant="outlined" onClick={() => setDefaultModalOpen(true)}>
                        Add Default Contract
                    </Button>
                </Box>
            </Box>

            {/* Otsinguväli */}
            <Box mb={2} display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Search by user fullName"
                    value={search}

                    onChange={handleSearchChange}
                    size="small"
                />
            </Box>

            {/* Lepingute tabel */}
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('createdAt')}>
                                Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('userId')}>
                                User FullName {sortBy === 'userId' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('contractType')}>
                                Contract Type {sortBy === 'contractType' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('status')}>
                                Status {sortBy === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {contracts.map((contract) => {
                            const isOpen = !!openRows[contract.id];
                            return (
                                <React.Fragment key={contract.id}>
                                    <TableRow
                                        hover
                                        sx={{cursor: 'pointer'}}
                                        onClick={() => toggleRow(contract.id)}
                                    >

                                        <TableCell>
                                            {new Date(contract.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{contract.user.fullName}</TableCell>
                                        <TableCell>{contract.contractType}</TableCell>
                                        <TableCell>
                                            <FiberManualRecordIcon
                                                sx={{ color: handleStatusColor(contract.status), fontSize: 12, mr: 1 }}
                                            />
                                            {contract.status}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(contract);
                                                }}
                                            >
                                                Send
                                            </Button>

                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell colSpan={5} sx={{p: 0, borderBottom: 'none'}}>
                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                <Box
                                                    sx={{
                                                        m: 2,
                                                        p: 2,
                                                        border: '1px solid #ddd',
                                                        borderRadius: 2,
                                                        backgroundColor: '#fafafa',
                                                    }}
                                                >

                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        Payment Holidays
                                                    </Typography>

                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>From Date</TableCell>
                                                                <TableCell>To Date</TableCell>
                                                                <TableCell>Reason</TableCell>
                                                                <TableCell>Accepted</TableCell>
                                                                <TableCell />
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {contract.paymentHolidays.map((ph) => (
                                                                <TableRow key={ph.id}>
                                                                    <TableCell>
                                                                        {new Date(ph.fromDate).toLocaleDateString()}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {ph.toDate
                                                                            ? new Date(ph.toDate).toLocaleDateString()
                                                                            : '-'}
                                                                    </TableCell>
                                                                    <TableCell>{ph.reason}</TableCell>
                                                                    <TableCell>{ph.accepted}</TableCell>
                                                                    <TableCell>

                                                                        {ph.accepted === 'pending' && (
                                                                            <Box>
                                                                                <IconButton
                                                                                    color="success"
                                                                                    onClick={() =>
                                                                                        handleUpdatePhStatus(ph.id, 'approved')
                                                                                    }
                                                                                >
                                                                                    <CheckIcon />
                                                                                </IconButton>
                                                                                <IconButton
                                                                                    color="error"
                                                                                    onClick={() =>
                                                                                        handleUpdatePhStatus(ph.id, 'declined')
                                                                                    }
                                                                                >
                                                                                    <CloseIcon />
                                                                                </IconButton>
                                                                            </Box>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>



                                                    <Typography variant="h6" sx={{mb: 2}}>
                                                        Contract Details
                                                    </Typography>

                                                    {/* Kaheveeruline paigutus */}
                                                    <Grid container spacing={2}>
                                                        {/* Vasak veerg - makseinfo, validUntil, acceptedAt */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography>
                                                                <strong>Payment Type:</strong>{' '}
                                                                {contract.paymentType || 'N/A'}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Amount:</strong>{' '}
                                                                {contract.paymentAmount ?? 'N/A'}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Interval:</strong>{' '}
                                                                {contract.paymentInterval || 'N/A'}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Day:</strong>{' '}
                                                                {contract.paymentDay ?? 'N/A'}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Valid Until:</strong>{' '}
                                                                {contract.validUntil
                                                                    ? new Date(contract.validUntil).toLocaleDateString(
                                                                        'en-GB',
                                                                        {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric',
                                                                        }
                                                                    )
                                                                    : 'N/A'}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Accepted At:</strong>{' '}
                                                                {contract.acceptedAt
                                                                    ? new Date(contract.acceptedAt).toLocaleString()
                                                                    : 'Not accepted'}
                                                            </Typography>
                                                        </Grid>

                                                        {/* Parem veerg - lepingu sisu */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography sx={{fontWeight: 'bold', mb: 1}}>
                                                                Content:
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    whiteSpace: 'pre-line',
                                                                    backgroundColor: '#fff',
                                                                    p: 2,
                                                                    borderRadius: 1,
                                                                    boxShadow: 1,
                                                                }}
                                                            >
                                                                {contract.content}
                                                            </Box>
                                                        </Grid>
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

            {/* Modal: Add Contract */}
            {createModalOpen && (
                <CreateContract
                    open={createModalOpen}
                    affiliateId={affiliateId}
                    onClose={() => {
                        setCreateModalOpen(false);
                        loadContracts();
                    }}
                />
            )}

            {/* Modal: Add Default Contract */}
            {defaultModalOpen && (
                <AddDefaultContractModal
                    open={defaultModalOpen}
                    affiliateId={affiliateId}
                    onClose={() => {
                        setDefaultModalOpen(false);
                        // Kui soovid, võid siit uuesti lepingupõhjad laadida
                    }}
                />
            )}
        </Box>
    );
}
