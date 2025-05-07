// src/components/AffiliateTerms.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Tooltip,
    IconButton, TextareaAutosize
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import { createAffiliateTerms, updateAffiliateTerms, getAffiliateTerms } from '../api/affiliateApi';

export default function AffiliateTerms({ affiliateId }) {
    const [terms, setTerms] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedTerms, setEditedTerms] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [termsExist, setTermsExist] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (affiliateId) {
            loadTerms();
        }
    }, [affiliateId]);

    const loadTerms = async () => {
        setIsLoading(true);
        try {
            const termsData = await getAffiliateTerms(affiliateId);

            // This will work whether we get {terms: "content"} or {terms: "", exists: false}
            setTerms(termsData.terms || '');
            setEditedTerms(termsData.terms || '');
            setTermsExist(!!termsData.terms); // Convert to boolean
        } catch (error) {
            console.error('Error loading affiliate terms:', error);
            setTerms('');
            setEditedTerms('');
            setTermsExist(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedTerms(terms);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedTerms(terms);
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        try {
            const termsData = {
                terms: editedTerms,
                affiliateId: affiliateId
            };

            let result;
            if (termsExist) {
                result = await updateAffiliateTerms(termsData);
            } else {
                result = await createAffiliateTerms(termsData);
            }

            if (result) {
                setTerms(editedTerms);
                setTermsExist(true);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving affiliate terms:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleTermsChange = (e) => {
        setEditedTerms(e.target.value);
    };

    return (
        <Card elevation={1}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#2c3e50' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Affiliate Terms & Conditions
                    </Typography>

                    <Box>
                        {isEditing ? (
                            <>
                                <Tooltip title="Save">
                                    <IconButton
                                        color="primary"
                                        onClick={handleSaveClick}
                                        disabled={isSaving}
                                        sx={{ mr: 1 }}
                                    >
                                        {isSaving ? <CircularProgress size={24} /> : <SaveIcon />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                    <IconButton
                                        color="error"
                                        onClick={handleCancelClick}
                                        disabled={isSaving}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={handleEditClick}
                                disabled={isLoading}
                            >
                                {termsExist ? 'Edit Terms' : 'Add Terms'}
                            </Button>
                        )}
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : isEditing ? (
                    <TextareaAutosize
                        minRows={5}
                        value={editedTerms}
                        onChange={handleTermsChange}
                        placeholder="Enter your affiliate terms and conditions here..."
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            borderColor: '#AAAAAA',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                ) : termsExist ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            backgroundColor: '#f8f9fa',
                            minHeight: '300px',
                            maxHeight: '600px',
                            overflowY: 'auto',
                            borderRadius: 1,
                            whiteSpace: 'pre-line'
                        }}
                    >
                        {terms}
                    </Paper>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 5,
                            color: 'text.secondary'
                        }}
                    >
                        <DescriptionIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" gutterBottom>
                            No Terms & Conditions Set
                        </Typography>
                        <Typography variant="body2">
                            Click the 'Add Terms' button to create your affiliate terms and conditions.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}