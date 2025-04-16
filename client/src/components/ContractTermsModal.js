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
import ReactMarkdown from 'react-markdown';
import { getContractTermsById } from '../api/contractApi';

export default function ContractTermsModal({ open, onClose, termsId }) {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('Contract Terms');

    useEffect(() => {
        // Set the dialog title based on localStorage role
        const userRole = localStorage.getItem('role');
        if (!userRole) {
            setDialogTitle('Terms and Conditions');
        } else {
            setDialogTitle('Contract Terms');
        }

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

    // Custom styling for markdown content
    const markdownStyles = {
        container: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: 1.6,
            padding: '0 16px'
        },
        heading1: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginTop: '24px',
            marginBottom: '16px'
        },
        heading2: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginTop: '20px',
            marginBottom: '12px'
        },
        heading3: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginTop: '16px',
            marginBottom: '8px'
        },
        paragraph: {
            marginBottom: '16px'
        },
        listItem: {
            marginLeft: '20px',
            marginBottom: '8px'
        }
    };

    // Component to render markdown without a library
    const renderMarkdown = (text) => {
        if (!text) return null;

        // Split by line breaks to process each line
        const lines = text.split('\n');

        return (
            <Box sx={markdownStyles.container}>
                {lines.map((line, index) => {
                    // Handle headings
                    if (line.startsWith('# ')) {
                        return (
                            <Typography key={index} variant="h1" sx={markdownStyles.heading1}>
                                {line.substring(2)}
                            </Typography>
                        );
                    }
                    if (line.startsWith('## ')) {
                        return (
                            <Typography key={index} variant="h2" sx={markdownStyles.heading2}>
                                {line.substring(3)}
                            </Typography>
                        );
                    }
                    if (line.startsWith('### ')) {
                        return (
                            <Typography key={index} variant="h3" sx={markdownStyles.heading3}>
                                {line.substring(4)}
                            </Typography>
                        );
                    }

                    // Handle bold text
                    if (line.includes('**')) {
                        const parts = line.split(/\*\*/);
                        return (
                            <Typography key={index} sx={markdownStyles.paragraph}>
                                {parts.map((part, i) => (
                                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                                ))}
                            </Typography>
                        );
                    }

                    // Handle list items
                    if (line.startsWith('- ')) {
                        return (
                            <Typography key={index} component="li" sx={markdownStyles.listItem}>
                                {line.substring(2)}
                            </Typography>
                        );
                    }

                    // Regular paragraph
                    if (line.trim() !== '') {
                        return (
                            <Typography key={index} sx={markdownStyles.paragraph}>
                                {line}
                            </Typography>
                        );
                    }

                    // Empty line
                    return <Box key={index} sx={{ height: '12px' }} />;
                })}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress />
                    </Box>
                ) : termsData ? (
                    renderMarkdown(termsData.terms)
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