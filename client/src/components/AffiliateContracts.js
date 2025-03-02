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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,

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

    // Lisame oleku dialoogi ja endDate haldamiseks
    const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
    const [newEndDate, setNewEndDate] = useState("");
    const [contractToDeactivate, setContractToDeactivate] = useState(null);

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
        if (contract.status === 'Waiting for acceptance' || contract.status === 'accepted') {
            alert('Contract is already sent');
            return;
        }

        const payload = {
            status: 'Waiting for acceptance',
        };
        await updateContract(contract.id, payload);
        await loadContracts();
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




    // Funktsioon dialoogi avamiseks
    const handleOpenDeactivateDialog = (contract) => {
        setContractToDeactivate(contract);
        setOpenDeactivateDialog(true);
    };

    // Funktsioon dialoogi sulgemiseks ja deaktiveerimiseks
    const handleConfirmDeactivate = () => {
        if (newEndDate && contractToDeactivate) {
            handleDeActivate({ ...contractToDeactivate, endDate: newEndDate, affiliateId });
        }
        setOpenDeactivateDialog(false);
        setNewEndDate(""); // Lähtestame sisestatud väärtuse
        setContractToDeactivate(null);
    };

    // Funktsioon dialoogi tühistamiseks
    const handleCancelDeactivate = () => {
        setOpenDeactivateDialog(false);
        setNewEndDate("");
        setContractToDeactivate(null);
    };

    const handleDeActivate = async (contractData) => {
        const payload = {
            affiliateId: contractData.affiliateId,
            userId: contractData.userId,
            endDate: contractData.endDate, // Võtame endDate otse objektist
            action: 'change end date',

        };
        await updateContract(contractData.id, payload);
        await loadContracts();
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
                            <TableCell>ID</TableCell>
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
                                        <TableCell>{contract.id}</TableCell>
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

                                            { contract.status === 'draft' ? (

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
                                                ) : (

                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to change end date on this contract?')) {
                                                        handleOpenDeactivateDialog(contract);
                                                    }
                                                }}
                                            >
                                                Change End Date
                                            </Button>
                                        )}

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
                                                                <TableCell>Month</TableCell>
                                                                <TableCell>Reason</TableCell>
                                                                <TableCell>Accepted</TableCell>
                                                                <TableCell />
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {contract.paymentHolidays.map((ph) => (
                                                                <TableRow key={ph.id}>
                                                                    <TableCell>{ph.month}</TableCell>
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

            <Dialog
                open={openDeactivateDialog}
                onClose={handleCancelDeactivate}
                aria-labelledby="deactivate-dialog-title"
            >
                <DialogTitle id="deactivate-dialog-title">Set New End Date</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the new end date for the contract deactivation.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New End Date"
                        type="date"
                        fullWidth
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDeactivate} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDeactivate} color="primary" disabled={!newEndDate}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

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
