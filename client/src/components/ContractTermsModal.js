import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    IconButton
} from '@mui/material';
import { getContractTermsById } from '../api/contractApi';

export default function ContractTermsModal({ open, onClose, termsId }) {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('Contract Terms');
    const [termsType, setTermsType] = useState('register');

    // Get user role once for consistent use throughout component
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        // Set the dialog title and initial terms type based on localStorage role
        if (!userRole) {
            setDialogTitle('Terms and Conditions');
            // Default to "register" when no role is present
            setTermsType('register');
        } else {
            setDialogTitle('Contract Terms');
            // Use the provided termsId when role exists
            setTermsType(termsId);
        }
    }, [open, termsId, userRole]);

    useEffect(() => {
        // Fetch terms when termsType is set and modal is open
        if (open && termsType) {
            fetchTerms();
        }
    }, [termsType, open]);

    const fetchTerms = async () => {
        try {
            setLoading(true);
            console.log("Fetching terms with type:", termsType);
            const data = await getContractTermsById(termsType);
            console.log("Fetched data:", data);
            setTermsData(data || null);
        } catch (error) {
            console.error("Error fetching terms:", error);
            setTermsData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = () => {
        // Choose the Estonian terms type based on whether user has a role
        if (userRole) {
            // If user has a role, use contractEST type
            console.log("Changing language to Estonian, setting terms type to 'contractEST'");
            setTermsType('contractEST');
        } else {
            // If user has no role, use registerEST type
            console.log("Changing language to Estonian, setting terms type to 'registerEST'");
            setTermsType('registerEST');
        }
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

    // Estonian flag component
    const EstonianFlag = () => {
        return (
            <IconButton
                onClick={handleLanguageChange}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 8,
                    width: 36,
                    height: 24,
                    p: 0,
                    overflow: 'hidden',
                    border: '1px solid #ccc'
                }}
            >
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ flex: 1, bgcolor: '#0072CE', width: '100%' }} />
                    <Box sx={{ flex: 1, bgcolor: '#000000', width: '100%' }} />
                    <Box sx={{ flex: 1, bgcolor: '#FFFFFF', width: '100%' }} />
                </Box>
            </IconButton>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ position: 'relative' }}>
                {dialogTitle}
                <EstonianFlag />
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress />
                    </Box>
                ) : termsData ? (
                    renderMarkdown(termsData.terms)
                ) : (
                    <Typography>No terms found. {termsType ? `Attempted to load terms with type: ${termsType}` : 'No terms type specified'}</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}