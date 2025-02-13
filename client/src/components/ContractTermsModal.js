import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { getContractTermsById } from '../api/contractApi';

export default function ContractTermsModal({ open, onClose, termsId }) {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && termsId) {
            fetchTerms();
        }
    }, [open, termsId]);

    const fetchTerms = async () => {
        setLoading(true);
        const data = await getContractTermsById(termsId);
        setTermsData(data || null);
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Contract Terms</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress />
                    </Box>
                ) : termsData ? (
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {termsData.terms}
                    </Typography>
                ) : (
                    <Typography>No terms found.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
