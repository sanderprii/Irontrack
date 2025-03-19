import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
} from '@mui/material';
import { createContractTemplate, getLatestContractTemplate } from '../api/contractApi';
import TextareaAutosize from "@mui/material/TextareaAutosize";

export default function AddDefaultContractModal({ open, onClose, affiliateId }) {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (open) {
            loadTemplate();
        }
    }, [open]);

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleSave = async () => {
        if (!content.trim()) {
            alert('Please enter the contract text!');
            return;
        }
        await createContractTemplate(content, affiliateId);
        onClose();
    };

    const loadTemplate = async () => {
        const template = await getLatestContractTemplate(affiliateId);
        if (template?.content) {
            setContent(template.content);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add Default Contract</DialogTitle>
            <DialogContent dividers>
                <FormControl fullWidth margin="normal">
                    <TextareaAutosize
                        minRows={10}
                        value={content}
                        onChange={handleChange}
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
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Template
                </Button>
            </DialogActions>
        </Dialog>
    );
}
