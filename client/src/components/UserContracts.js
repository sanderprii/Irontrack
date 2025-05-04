import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Collapse,
    Box,
    Typography,
    Checkbox,
    Paper,
    Button,
    Modal,
    TextField,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
    Card,
    CardContent,
    Divider,
    Chip,
    Grid,
    Stack
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import {
    getUserContracts,
    acceptContract,
    createPaymentHoliday,
    updatePaymentHoliday,
    updateContract,
} from '../api/contractApi';
import { getAffiliateById} from "../api/affiliateApi";
import ContractTermsModal from './ContractTermsModal';
import { sendMessageToAffiliate } from "../api/messageApi";
import MenuItem from "@mui/material/MenuItem";
import {useNavigate} from "react-router-dom";

export default function UserContracts({ user, affiliateId }) {
    const [contracts, setContracts] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [acceptCheckbox, setAcceptCheckbox] = useState({});
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const [selectedContractTermsId, setSelectedContractTermsId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Payment Holiday Modal state
    const [phModalOpen, setPhModalOpen] = useState(false);
    const [phContract, setPhContract] = useState(null);
    const [phData, setPhData] = useState({
        fromDate: '',
        toDate: '',
        reason: '',
    });

    const navigate = useNavigate();

    // Lisame oleku dialoogi ja endDate haldamiseks
    const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
    const [newEndDate, setNewEndDate] = useState("");
    const [contractToDeactivate, setContractToDeactivate] = useState(null);

    useEffect(() => {
        if (user?.id) {
            loadContracts();
        }
    }, [user]);

    const loadContracts = async () => {
        const data = await getUserContracts(user.id);
        if (Array.isArray(data)) {
            setContracts(data);
        }
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

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCheckboxChange = (contractId, checked) => {
        setAcceptCheckbox((prev) => ({ ...prev, [contractId]: checked }));
    };

    const handleAccept = async (contract) => {
        // Kontrollime, et affiliateId on olemas ja õiges formaadis
        let parsedAffiliateId = affiliateId;
        if (!parsedAffiliateId && contract && contract.affiliateId) {
            parsedAffiliateId = contract.affiliateId;
        }

        if (!parsedAffiliateId) {
            alert('Puudub affiliateId! Palun võtke ühendust administraatoriga.');
            return;
        }

        // Veendume, et affiliateId on number
        parsedAffiliateId = parseInt(parsedAffiliateId);

        if (isNaN(parsedAffiliateId)) {
            alert('AffiliateId pole korrektses formaadis! Palun võtke ühendust administraatoriga.');
            return;
        }



        // Suuname kasutaja checkout lehele lepingu andmetega
        navigate('/checkout', {
            state: {
                contract: contract,
                plan: {
                    id: 'contract-payment', // Spetsiaalne identifikaator lepingu maksete jaoks
                    name: `${contract.paymentType || 'Monthly'} Contract Payment`,
                    price: contract.paymentAmount,
                    trainingType: contract.trainingType,
                    affiliateId: parsedAffiliateId, // Kasuta parsitud ID-d
                    validityDays: 31, // Standardne 30-päevane kehtivus esimesele maksele
                    sessions: 999, // Piisavalt suur arv, et kasutaja saaks käia nii palju kui tahab

                },
                affiliate: {
                    id: parsedAffiliateId,
                    name: contract.affiliate?.name || 'Affiliate'
                },
                userData: user,
                isContractPayment: true
            }
        });
    };

    const openTerms = (contract) => {
        setSelectedContractTermsId('contract'); // siia reaalne contractTermsId, kui sul on
        setTermsModalOpen(true);
    };

    // Avab Payment Holiday modali ja salvestab state-sse lepingu, mille jaoks andmeid kogume
    const handleOpenPhModal = (contract) => {
        setPhContract(contract);
        setPhModalOpen(true);
    };

    // Sulgeb Payment Holiday modali
    const handleClosePhModal = () => {
        setPhModalOpen(false);
        setPhContract(null);
        setPhData({ fromDate: '', toDate: '', reason: '' });
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide after 3 seconds
    };

    // Väljade muutmise handler
    const handlePhDataChange = (e) => {
        const { name, value } = e.target;
        setPhData((prev) => ({ ...prev, [name]: value }));
    };

    // "Save" nupp modalis
    const handlePhSave = async () => {
        if (!phContract) return;

        // Kutsume API-d
        const payload = {
            contractId: phContract.id,
            userId: user.id,
            affiliateId: phContract.affiliateId,
            month: phData.month,
            reason: phData.reason,
        };

        const result = await createPaymentHoliday(payload);
        if (result && result.success) {
            alert('Payment holiday request created successfully!');
            const getAffiliateData = await getAffiliateById(phContract.affiliateId);

            const subject = 'Payment Holiday Request';
            const body = `You have received a payment holiday request from <strong>${user.fullName}</strong> for ${phData.month}.`;
            const senderEmail = user.email;

            const affiliateEmail = getAffiliateData.email;
            await sendMessageToAffiliate(senderEmail, affiliateEmail, subject, body)
        } else {
            alert('Error creating payment holiday request!');
        }

        handleClosePhModal();
        await loadContracts();
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
            showSuccessMessage("Contract end date updated successfully!");
        }
        setOpenDeactivateDialog(false);
        setNewEndDate("");
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

    const role = localStorage.getItem('role');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', ml: 2 }}>
                My Contracts
            </Typography>
            {/* Success message - add this after your "My Contracts" Typography */}
            {successMessage && (
                <Box sx={{ mb: 2, p: 1, bgcolor: '#e6f7e6', borderRadius: 1 }}>
                    <Typography color="success">{successMessage}</Typography>
                </Box>
            )}
            {contracts.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>No contracts found.</Typography>
                </Paper>
            ) : (
                <Card elevation={2} sx={{ overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>

                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Affiliate Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contracts.map((contract) => {
                                const isExpanded = expandedRows[contract.id] || false;
                                const isSent = contract.status === 'Waiting for acceptance';
                                return (
                                    <React.Fragment key={contract.id}>
                                        <TableRow
                                            hover
                                            onClick={() => toggleRow(contract.id)}
                                            sx={{ cursor: 'pointer' }}
                                        >

                                            <TableCell>
                                                {formatDate(contract.createdAt)}
                                            </TableCell>
                                            <TableCell>{contract.affiliate.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={contract.status}
                                                    color={
                                                        contract.status === 'accepted' ? 'success' :
                                                            contract.status === 'Waiting for acceptance' ? 'warning' :
                                                                contract.status === 'terminated' ? 'error' :
                                                                    'primary'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                { contract.status === 'accepted' && role === 'affiliate' && (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        size='small'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDeactivateDialog(contract);
                                                        }}
                                                    >
                                                        End Date
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 2 }}>
                                                        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                            Contract Details
                                                        </Typography>

                                                        <Grid container spacing={3}>
                                                            {/* Payment Holidays Card */}
                                                            <Grid item xs={12}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <CalendarMonthIcon sx={{ mr: 1 }} />
                                                                            Payment Holidays
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        {contract.paymentHolidays && contract.paymentHolidays.length > 0 ? (
                                                                            <Table>
                                                                                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
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
                                                                                                        ph.accepted === 'approved' ? 'success' :
                                                                                                            ph.accepted === 'declined' ? 'error' :
                                                                                                                'warning'
                                                                                                    }
                                                                                                    size="small"
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {/* Kui role===affiliate ja ph.accepted==='pending',
                                                                                                    siis kuvame rohelise & punase nupu */}
                                                                                                {role === 'affiliate' && ph.accepted === 'pending' && (
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
                                                                            <Typography variant="body1" sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                                                                                No payment holidays found for this contract
                                                                            </Typography>
                                                                        )}

                                                                        {/* PaymentHoliday nupp (Request) — kui leping on accepted ja kasutaja on 'regular' */}
                                                                        {contract.status === 'accepted' && role === 'regular' && (
                                                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                                                                <Button
                                                                                    variant="outlined"
                                                                                    color="warning"
                                                                                    startIcon={<EventIcon />}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleOpenPhModal(contract);
                                                                                    }}
                                                                                >
                                                                                    Request Payment Holiday
                                                                                </Button>
                                                                            </Box>
                                                                        )}
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
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                                    {contract.paymentAmount} €
                                                                                </Typography>
                                                                            </Box>
                                                                            { contract.isFirstPayment && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    First Payment Amount:
                                                                                </Typography>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                                    {contract.firstPaymentAmount} €
                                                                                </Typography>
                                                                            </Box>
                                                                            )}
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
                                                                                    {contract.paymentDay || 'N/A'}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                            {/* Contract Information Card */}
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
                                                                                    Contract ID:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {contract.id}
                                                                                </Typography>
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
                                                                                    Created Date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {formatDate(contract.createdAt)}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Starting date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {formatDate(contract.startDate)}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Valid Until:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {formatDate(contract.validUntil)}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Status:
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={contract.status}
                                                                                    color={
                                                                                        contract.status === 'accepted' ? 'success' :
                                                                                            contract.status === 'Waiting for acceptance' ? 'warning' :
                                                                                                contract.status === 'terminated' ? 'error' :
                                                                                                    'primary'
                                                                                    }
                                                                                    size="small"
                                                                                />
                                                                            </Box>
                                                                        </Box>
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
                                                                                backgroundColor: '#f8f9fa',
                                                                                p: 2,
                                                                                borderRadius: 1,
                                                                                maxHeight: '300px',
                                                                                overflowY: 'auto'
                                                                            }}
                                                                        >
                                                                            {contract.content}
                                                                        </Box>

                                                                        {/* Accept Contract section */}
                                                                        {isSent && role === 'regular' && (
                                                                            <Box sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                gap: 2,
                                                                                mt: 3,
                                                                                p: 2,
                                                                                borderRadius: 1,
                                                                                border: '1px solid #e0e0e0',
                                                                                backgroundColor: '#f8f9fa'
                                                                            }}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <Checkbox
                                                                                        checked={!!acceptCheckbox[contract.id]}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        onChange={(e) =>
                                                                                            handleCheckboxChange(
                                                                                                contract.id,
                                                                                                e.target.checked
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <Typography>
                                                                                        I have read and understand Terms and Conditions
                                                                                    </Typography>
                                                                                    <Button
                                                                                        variant="outlined"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            openTerms(contract);
                                                                                        }}
                                                                                        size="small"
                                                                                    >
                                                                                        Open Terms
                                                                                    </Button>
                                                                                </Box>

                                                                                <Button
                                                                                    variant="contained"
                                                                                    color="success"
                                                                                    disabled={!acceptCheckbox[contract.id]}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleAccept(contract);
                                                                                    }}
                                                                                    sx={{ alignSelf: 'flex-start' }}
                                                                                >
                                                                                    Accept Contract
                                                                                </Button>
                                                                            </Box>
                                                                        )}
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
                </Card>
            )}

            {/* Contract Terms modal */}
            {termsModalOpen && (
                <ContractTermsModal
                    open={termsModalOpen}
                    onClose={() => setTermsModalOpen(false)}
                    termsId={selectedContractTermsId}
                />
            )}

            {/* PaymentHoliday Modal */}
            <Modal open={phModalOpen} onClose={handleClosePhModal}>
                <Card
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: 400,
                        maxWidth: 600,
                        outline: 'none',
                        boxShadow: 24,
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50', mb: 2 }}>
                            <EventIcon sx={{ mr: 1 }} />
                            Request Payment Holiday
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {/* Month Selector with Tooltip */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <TextField
                                select
                                label="Month"
                                name="month"
                                value={phData.month || ''}
                                onChange={handlePhDataChange}
                                fullWidth
                            >
                                <MenuItem value="January">January</MenuItem>
                                <MenuItem value="February">February</MenuItem>
                                <MenuItem value="March">March</MenuItem>
                                <MenuItem value="April">April</MenuItem>
                                <MenuItem value="May">May</MenuItem>
                                <MenuItem value="June">June</MenuItem>
                                <MenuItem value="July">July</MenuItem>
                                <MenuItem value="August">August</MenuItem>
                                <MenuItem value="September">September</MenuItem>
                                <MenuItem value="October">October</MenuItem>
                                <MenuItem value="November">November</MenuItem>
                                <MenuItem value="December">December</MenuItem>
                            </TextField>
                            <Tooltip
                                title="Select the month for which you want to request a payment holiday. Payment holiday start date will be same as payment day."
                                arrow
                                placement="right"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                                color: 'primary.main',
                                            },
                                            boxShadow: 1,
                                            fontSize: '0.85rem',
                                            p: 1,
                                            maxWidth: 220
                                        }
                                    }
                                }}
                            >
                                <IconButton
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 1, mt: 1 }}
                                    aria-label="Month info"
                                >
                                    <HelpOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Reason Field with Tooltip */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <TextField
                                label="Reason"
                                name="reason"
                                multiline
                                rows={3}
                                value={phData.reason}
                                onChange={handlePhDataChange}
                                fullWidth
                            />
                            <Tooltip
                                title="Please provide a detailed reason for your payment holiday request"
                                arrow
                                placement="right"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: 'primary.main',
                                            '& .MuiTooltip-arrow': {
                                                color: 'primary.main',
                                            },
                                            boxShadow: 1,
                                            fontSize: '0.85rem',
                                            p: 1,
                                            maxWidth: 220
                                        }
                                    }
                                }}
                            >
                                <IconButton
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 1, mt: 1 }}
                                    aria-label="Reason info"
                                >
                                    <HelpOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                onClick={handleClosePhModal}
                                color="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handlePhSave}
                                startIcon={<EventIcon />}
                            >
                                Save
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Modal>

            <Dialog
                open={openDeactivateDialog}
                onClose={handleCancelDeactivate}
                aria-labelledby="deactivate-dialog-title"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: 500
                    }
                }}
            >
                <DialogTitle id="deactivate-dialog-title" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <CalendarMonthIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    Set New End Date
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <DialogContentText>
                        Are you sure you want to change the end date for this contract?
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
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                        onClick={handleCancelDeactivate}
                        color="inherit"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDeactivate}
                        color="secondary"
                        disabled={!newEndDate}
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}