// src/components/AffiliateTermsModal.js
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
import { getAffiliateTerms } from '../api/affiliateApi';

export default function AffiliateTermsModal({ open, onClose, affiliateId }) {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && affiliateId) {
            fetchTerms();
        }
    }, [open, affiliateId]);

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const data = await getAffiliateTerms(affiliateId);
            setTermsData(data || { terms: 'No terms available for this affiliate.' });
        } catch (error) {
            console.error("Error fetching affiliate terms:", error);
            setTermsData({ terms: 'Error loading terms. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    // Simple markdown-style renderer for terms content
    const renderTermsContent = (text) => {
        if (!text) return null;

        const lines = text.split('\n');

        return (
            <Box sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', lineHeight: 1.6 }}>
                {lines.map((line, index) => {
                    if (line.trim() === '') {
                        return <Box key={index} sx={{ height: '12px' }} />;
                    }
                    return (
                        <Typography key={index} sx={{ mb: 1 }}>
                            {line}
                        </Typography>
                    );
                })}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Affiliate Terms & Conditions
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress />
                    </Box>
                ) : termsData ? (
                    renderTermsContent(termsData.terms)
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