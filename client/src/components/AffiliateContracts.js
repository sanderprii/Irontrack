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
    Grid,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Divider,
    Chip,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {getContracts, deleteContract, updateContract} from '../api/contractApi';
import {sendMessage} from '../api/messageApi'; // Import sendMessage function
import {getAffiliateById} from "../api/affiliateApi";
import CreateContract from './CreateContract';
import AddDefaultContractModal from './AddDefaultContractModal';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {updatePaymentHoliday} from "../api/contractApi";

export default function AffiliateContracts({affiliateId}) {
    const [contracts, setContracts] = useState([]);
    const [allContracts, setAllContracts] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
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

    // Apply filters whenever search or statusFilter changes
    useEffect(() => {
        applyFilters();
    }, [search, statusFilter, allContracts]);

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

            setAllContracts(sortedData);
            setContracts(sortedData);
        }
    };

    // Apply both name search and status filters
    const applyFilters = () => {
        let filteredContracts = [...allContracts];

        // Apply name search filter
        if (search.trim()) {
            filteredContracts = filteredContracts.filter(contract =>
                contract.user.fullName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filteredContracts = filteredContracts.filter(contract =>
                contract.status === statusFilter
            );
        }

        setContracts(filteredContracts);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);

        if (e.target.value.length > 0) {
            setSortBy("fullName");
        } else {
            setSortBy("createdAt");
        }
    };

    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
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
            case 'terminated':
                return 'gray';
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

        try {
            // Update contract status
            const payload = {
                status: 'Waiting for acceptance',
            };
            await updateContract(contract.id, payload);

            // Get affiliate information for the email
            const affiliateInfo = await getAffiliateById(affiliateId);

            // Prepare email content
            const emailSubject = `New Contract for Signature from ${affiliateInfo?.name || 'your affiliate'}`;
            const emailBody = `
            <p>Hello ${contract.user.fullName},</p>
            
            <p>You have received a new contract from ${affiliateInfo?.name || 'your affiliate'} 
            that requires your signature.</p>
            
            <p><strong>Contract details:</strong></p>
            <ul>
                <li>Contract Type: ${contract.contractType || 'Standard Contract'}</li>
                <li>Created Date: ${new Date(contract.createdAt).toLocaleDateString()}</li>
                ${contract.paymentAmount ?
                `<li>Payment Amount: ${contract.paymentAmount} €</li>` : ''}
                ${contract.paymentInterval ?
                `<li>Payment Interval: ${contract.paymentInterval}</li>` : ''}
            </ul>
            
            <p>Please log in to your account to review and sign the contract.</p>
            
            <p>Thank you,<br>
            ${affiliateInfo?.name || 'Your Affiliate'} Team</p>
            `;

            // Send notification email to the user
            await sendMessage({
                recipientType: 'user',
                groupName: '', // Not needed for individual user
                senderId: affiliateId,
                recipientId: contract.userId, // User ID who should receive the contract
                subject: emailSubject,
                body: emailBody,
                affiliateEmail: affiliateInfo?.email || 'info@affiliate.com'
            });

            // Reload contracts and show success message
            await loadContracts();
            alert('Contract sent successfully and notification email has been sent to the user.');
        } catch (error) {
            console.error('Error updating contract or sending email:', error);
            alert('An error occurred while sending the contract. Please try again.');
        }
    };

    // Handle delete contract with confirmation
    const handleDelete = async (contract) => {
        if (window.confirm('Are you sure you want to delete this contract?')) {
            try {
                await deleteContract(contract.id);
                await loadContracts(); // Reload contracts after deletion
            } catch (error) {
                console.error('Error deleting contract:', error);
                alert('Failed to delete contract');
            }
        }
    };

    const toggleRow = (id) => {
        setOpenRows((prev) => ({...prev, [id]: !prev[id]}));
    };

    // Get training types as an array
    const getTrainingTypesArray = (trainingType) => {
        if (!trainingType) return [];
        try {
            // Try to parse as JSON first (for the new format)
            return JSON.parse(trainingType);
        } catch (e) {
            // Fallback for old format (comma-separated string)
            return trainingType.split(',');
        }
    };

    // Get color for training type chip
    const getTrainingTypeColor = (type) => {
        switch (type) {
            case 'WOD':
                return 'primary';
            case 'Weightlifting':
                return 'secondary';
            case 'Rowing':
                return 'success';
            case 'Gymnastics':
                return 'info';
            case 'Open Gym':
                return 'warning';
            case 'Cardio':
                return 'error';
            case 'All classes':
                return 'default';
            default:
                return 'default';
        }
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

            {/* Otsingu- ja filtrisektsiooni */}
            <Box mb={2} display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Search by user fullName"
                    value={search}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{ minWidth: 220 }}
                />

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="Filter by Status"
                        onChange={handleStatusFilterChange}
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="Waiting for acceptance">Waiting for Acceptance</MenuItem>
                        <MenuItem value="terminated">Terminated</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
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
                                            {contract.status === 'draft' ? (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
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
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(contract);
                                                        }}
                                                        aria-label="Delete Contract"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ) : contract.status === 'Waiting for acceptance' ? (
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(contract);
                                                    }}
                                                    aria-label="Delete Contract"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            ) : contract.status === 'accepted' ? (
                                                <IconButton
                                                    color="secondary"
                                                    size="small"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to change end date on this contract?')) {
                                                            handleOpenDeactivateDialog(contract);
                                                        }
                                                    }}
                                                    aria-label="Change End Date"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            ) : null}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell colSpan={6} sx={{p: 0, borderBottom: 'none'}}>
                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                        Contract Details
                                                    </Typography>

                                                    {/* Termination Info (if contract is terminated) */}
                                                    {contract.status === 'terminated' && contract.latestLog && (
                                                        <Box sx={{ mb: 3, p: 2, bgcolor: '#fff8f8', borderRadius: 1, border: '1px solid #ffcdd2' }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                                                                Termination Information
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                <Typography variant="body2">
                                                                    <strong>Action:</strong> {contract.latestLog.action}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    <strong>Date:</strong> {new Date(contract.latestLog.createdAt).toLocaleString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    <Grid container spacing={3}>
                                                        {/* Contract Overview Card */}
                                                        <Grid item xs={12} md={6}>
                                                            <Card elevation={1} sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <DescriptionIcon sx={{ mr: 1 }} />
                                                                        Contract Information
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Contract Type:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {contract.contractType || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Status:
                                                                            </Typography>
                                                                            <Chip
                                                                                label={contract.status}
                                                                                color={contract.status === "accepted" ? "success" : contract.status === "draft" ? "primary" : "default"}
                                                                                size="small"
                                                                            />
                                                                        </Box>

                                                                        {/* Training Types Section */}
                                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140, mt: 0.5 }}>
                                                                                Training Types:
                                                                            </Typography>
                                                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                                                {getTrainingTypesArray(contract.trainingType).length > 0 ? (
                                                                                    getTrainingTypesArray(contract.trainingType).map((type, index) => (
                                                                                        <Chip
                                                                                            key={index}
                                                                                            label={type}
                                                                                            color={getTrainingTypeColor(type)}
                                                                                            size="small"
                                                                                            icon={<FitnessCenterIcon />}
                                                                                            sx={{ mb: 0.5 }}
                                                                                        />
                                                                                    ))
                                                                                ) : (
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        No training types specified
                                                                                    </Typography>
                                                                                )}
                                                                            </Stack>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Created At:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {new Date(contract.createdAt).toLocaleString()}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Accepted At:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {contract.acceptedAt
                                                                                    ? new Date(contract.acceptedAt).toLocaleString()
                                                                                    : 'Not accepted'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Valid Until:
                                                                            </Typography>
                                                                            <Typography variant="body1">
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
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        {/* Payment Information Card */}
                                                        <Grid item xs={12} md={6}>
                                                            <Card elevation={1} sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <PaymentIcon sx={{ mr: 1 }} />
                                                                        Payment Information
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Payment Type:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {contract.paymentType || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Payment Amount:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {contract.paymentAmount ? `${contract.paymentAmount} €` : 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Payment Interval:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {contract.paymentInterval || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Payment Day:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {contract.paymentDay ?? 'N/A'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        {/* Payment Holidays Card */}
                                                        <Grid item xs={12}>
                                                            <Card elevation={1}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <EventIcon sx={{ mr: 1 }} />
                                                                        Payment Holidays
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    {contract.paymentHolidays && contract.paymentHolidays.length > 0 ? (
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                                                                                    <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
                                                                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {contract.paymentHolidays.map((ph) => (
                                                                                    <TableRow key={ph.id}>
                                                                                        <TableCell>{ph.month}</TableCell>
                                                                                        <TableCell>{ph.reason}</TableCell>
                                                                                        <TableCell>
                                                                                            <Chip
                                                                                                label={ph.accepted}
                                                                                                color={
                                                                                                    ph.accepted === 'approved'
                                                                                                        ? 'success'
                                                                                                        : ph.accepted === 'declined'
                                                                                                            ? 'error'
                                                                                                            : 'warning'
                                                                                                }
                                                                                                size="small"
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            {ph.accepted === 'pending' && (
                                                                                                <Box>
                                                                                                    <IconButton
                                                                                                        color="success"
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            handleUpdatePhStatus(ph.id, 'approved');
                                                                                                        }}
                                                                                                    >
                                                                                                        <CheckIcon />
                                                                                                    </IconButton>
                                                                                                    <IconButton
                                                                                                        color="error"
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            handleUpdatePhStatus(ph.id, 'declined');
                                                                                                        }}
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
                                                                    ) : (
                                                                        <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                                                                            No payment holidays found for this contract
                                                                        </Typography>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        {/* Contract Content Card */}
                                                        <Grid item xs={12}>
                                                            <Card elevation={1}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <DescriptionIcon sx={{ mr: 1 }} />
                                                                        Contract Content
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box
                                                                        sx={{
                                                                            whiteSpace: 'pre-line',
                                                                            backgroundColor: '#fff',
                                                                            p: 2,
                                                                            borderRadius: 1,
                                                                            boxShadow: 1,
                                                                            maxHeight: '300px',
                                                                            overflowY: 'auto'
                                                                        }}
                                                                    >
                                                                        {contract.content}
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
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
                        Please enter the new end date for the contract.
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