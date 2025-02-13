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
} from '@mui/material';
import { getUserContracts, acceptContract } from '../api/contractApi';
import ContractTermsModal from './ContractTermsModal';
import {sendMessage} from "../api/messageApi";

export default function UserContracts({ user }) {
    const [contracts, setContracts] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [acceptCheckbox, setAcceptCheckbox] = useState({}); // iga lepingu jaoks hoiab kas checked v mitte
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const [selectedContractTermsId, setSelectedContractTermsId] = useState(null);

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

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCheckboxChange = (contractId, checked) => {
        setAcceptCheckbox((prev) => ({ ...prev, [contractId]: checked }));
    };

    const handleAccept = async (contract) => {
        // Eeldame, et sul on contract.affiliateId, user.id, mingid termsId
        // NB! Kui sul on ContractTerms, defineeri see contract objekti sees (nt contract.termsId).
        // Näitena eeldame fix-lahendust contractTermsId=1
        const payload = {
            userId: user.id,
            affiliateId: contract.affiliateId,
            acceptType: 'checkbox',
            contractTermsId: 1,
        };
        await acceptContract(contract.id, payload);

        await loadContracts();
    };

    const openTerms = (contract) => {
        // Kui sul on contract.termsId, kasuta seda
        const termsType = 'contract'
        setSelectedContractTermsId(termsType);
        setTermsModalOpen(true);
    };

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
                                <TableCell>Date</TableCell>
                                <TableCell>Affiliate Name</TableCell>
                                <TableCell>Status</TableCell>

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
                                                {new Date(contract.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{contract.affiliate.name}</TableCell>
                                            <TableCell>{contract.status}</TableCell>

                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ p: 0 }}>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Box m={2}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
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

                                                        {/* Näide makseinfo kuvamiseks */}
                                                        <Box mt={2}>
                                                            <Typography>
                                                                <strong>Payment Type:</strong> {contract.paymentType}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Amount:</strong> {contract.paymentAmount}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Interval:</strong>{' '}
                                                                {contract.paymentInterval}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Payment Day:</strong> {contract.paymentDay}
                                                            </Typography>
                                                        </Box>

                                                            {isSent && (
                                                                <Box display="flex" flexDirection="column" gap={1}>
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
                                                                        <Typography>I have read and understand Terms and Conditions</Typography>
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
        </Box>
    );
}
