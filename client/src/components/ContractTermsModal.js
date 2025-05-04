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
    const [isEstonian, setIsEstonian] = useState(false);

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
        // Start with English (UK flag showing)
        setIsEstonian(false);
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

            const data = await getContractTermsById(termsType);

            setTermsData(data || null);
        } catch (error) {
            console.error("Error fetching terms:", error);
            setTermsData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = () => {
        // Toggle between Estonian and English
        if (!isEstonian) {
            // Switch to Estonian
            if (userRole) {
                setTermsType('contractEST');
            } else {
                setTermsType('registerEST');
            }
            setIsEstonian(true);
        } else {
            // Switch to English
            if (userRole) {
                setTermsType(termsId); // Use the provided termsId for English
            } else {
                setTermsType('register'); // Default English type
            }
            setIsEstonian(false);
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

    // Flag Component - either Estonian or UK flag based on state
    const LanguageFlag = () => {
        // UK flag component
        if (!isEstonian) {
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
                    {/* Union Jack design - simplified version */}
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: '#00247D',
                        position: 'relative'
                    }}>
                        {/* White diagonal crosses */}
                        <Box sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            top: 0,
                        }}>
                            {/* White X cross */}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'linear-gradient(to bottom right, transparent calc(50% - 2px), white calc(50% - 1px), white calc(50% + 1px), transparent calc(50% + 2px)), linear-gradient(to bottom left, transparent calc(50% - 2px), white calc(50% - 1px), white calc(50% + 1px), transparent calc(50% + 2px))'
                            }} />

                            {/* Red X cross */}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'linear-gradient(to bottom right, transparent calc(50% - 1px), #CF142B calc(50% - 0.5px), #CF142B calc(50% + 0.5px), transparent calc(50% + 1px)), linear-gradient(to bottom left, transparent calc(50% - 1px), #CF142B calc(50% - 0.5px), #CF142B calc(50% + 0.5px), transparent calc(50% + 1px))'
                            }} />

                            {/* White + cross */}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'linear-gradient(to bottom, transparent calc(50% - 3px), white calc(50% - 3px), white calc(50% + 3px), transparent calc(50% + 3px)), linear-gradient(to right, transparent calc(50% - 3px), white calc(50% - 3px), white calc(50% + 3px), transparent calc(50% + 3px))'
                            }} />

                            {/* Red + cross */}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'linear-gradient(to bottom, transparent calc(50% - 2px), #CF142B calc(50% - 2px), #CF142B calc(50% + 2px), transparent calc(50% + 2px)), linear-gradient(to right, transparent calc(50% - 2px), #CF142B calc(50% - 2px), #CF142B calc(50% + 2px), transparent calc(50% + 2px))'
                            }} />
                        </Box>
                    </Box>
                </IconButton>
            );
        } else {
            // Estonian flag
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
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ position: 'relative' }}>
                {dialogTitle}
                <LanguageFlag />
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