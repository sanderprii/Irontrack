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

import {
    getUserContracts,
    acceptContract,
    createPaymentHoliday,
    updatePaymentHoliday,
    updateContract,
} from '../api/contractApi'; // <-- API import
import ContractTermsModal from './ContractTermsModal';
import { sendMessage } from "../api/messageApi";

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
        const payload = {
            userId: user.id,
            affiliateId: contract.affiliateId,
            acceptType: 'checkbox',
            contractTermsId: 1, // või mingi sobiv ID
        };
        await acceptContract(contract.id, payload);
        await loadContracts();
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
            fromDate: phData.fromDate,
            toDate: phData.toDate,
            reason: phData.reason,
        };

        const result = await createPaymentHoliday(payload);
        if (result && result.success) {
            alert('Payment holiday request created successfully!');
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
                    <TextField
                        label="From Date"
                        type="date"
                        name="fromDate"
                        value={phData.fromDate}
                        onChange={handlePhDataChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        name="toDate"
                        value={phData.toDate}
                        onChange={handlePhDataChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Reason"
                        name="reason"
                        multiline
                        rows={3}
                        value={phData.reason}
                        onChange={handlePhDataChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
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
