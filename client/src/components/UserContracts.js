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
    IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {
    getUserContracts,
    acceptContract,
    createPaymentHoliday,
    updatePaymentHoliday,
    updateContract,
} from '../api/contractApi'; // <-- API import
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
        const data = await getUserContracts(user.id, affiliateId);
        if (Array.isArray(data)) {
            setContracts(data);
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

        console.log("Navigating to checkout with affiliateId:", parsedAffiliateId);

        // Suuname kasutaja checkout lehele lepingu andmetega
        navigate('/checkout', {
            state: {
                contract: contract,
                plan: {
                    id: 'contract-payment', // Spetsiaalne identifikaator lepingu maksete jaoks
                    name: `${contract.paymentType || 'Monthly'} Contract Payment`,
                    price: contract.paymentAmount,
                    affiliateId: parsedAffiliateId, // Kasuta parsitud ID-d
                    validityDays: 30, // Standardne 30-päevane kehtivus esimesele maksele
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



    const role = localStorage.getItem('role');



    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                My Contracts
            </Typography>
            {contracts.length === 0 ? (
                <Typography>No contracts found.</Typography>
            ) : (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Affiliate Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell> </TableCell>
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
                                            <TableCell>{contract.id}</TableCell>
                                            <TableCell>
                                                {new Date(contract.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{contract.affiliate.name}</TableCell>
                                            <TableCell>{contract.status}</TableCell>
                                            <TableCell>
                                                { contract.status === 'accepted' && role === 'affiliate' && (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        size='small'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Are you sure you want to change end date on this contract?')) {
                                                                handleOpenDeactivateDialog(contract);
                                                            }

                                                        }
                                                        }
                                                    >
                                                        End Date
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ p: 0 }}>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Box m={2}>
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
                                                                            {/* Kui role===affiliate ja ph.accepted==='pending',
                                                                                siis kuvame rohelise & punase nupu */}
                                                                            {role === 'affiliate' && ph.accepted === 'pending' && (
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

                                                        {/* PaymentHoliday nupp (Request) — kui leping on accepted ja kasutaja on 'regular' */}
                                                        {contract.status === 'accepted' && role === 'regular' && (
                                                            <Button
                                                                variant="contained"
                                                                color="warning"
                                                                sx={{ mt: 2 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenPhModal(contract);
                                                                }}
                                                            >
                                                                Request Payment Holiday
                                                            </Button>
                                                        )}

                                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                                                            Contract Content
                                                        </Typography>
                                                        <Box mt={2}>
                                                            <Typography>
                                                                <strong>Payment Type:</strong> {contract.paymentType}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Amount:</strong> {contract.paymentAmount}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Interval:</strong> {contract.paymentInterval}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Day:</strong> {contract.paymentDay}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                backgroundColor: '#f7f7f7',
                                                                p: 2,
                                                                borderRadius: 2,
                                                                whiteSpace: 'pre-line',
                                                                mt: 1,
                                                            }}
                                                        >
                                                            {contract.content}
                                                        </Box>



                                                        {/* Kui staatus on "Waiting for acceptance", näita checkboxi ja "Accept Contract" nuppu */}
                                                        {isSent && role === 'regular' && (
                                                            <Box display="flex" flexDirection="column" gap={1} mt={2}>
                                                                <Box display="flex" alignItems="center" gap={1}>
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
                                                                >
                                                                    Accept Contract
                                                                </Button>
                                                            </Box>
                                                        )}
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
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#fff',
                        p: 4,
                        borderRadius: 2,
                        minWidth: 300,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Request Payment Holiday
                    </Typography>

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

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={handleClosePhModal} color="secondary">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handlePhSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>

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

        </Box>
    );
}
