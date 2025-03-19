// src/components/SendMessageModal.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import SendMessage from './SendMessage';

export default function SendMessageModal({
                                             open,
                                             onClose,
                                             affiliate,
                                             affiliateEmail,
                                             preSelectedUsers = []
                                         }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={window.innerWidth < 600}
        >
            <DialogTitle sx={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
                Send Message
            </DialogTitle>
            <DialogContent>
                <SendMessage
                    affiliate={affiliate}
                    affiliateEmail={affiliateEmail}
                    preSelectedUsers={preSelectedUsers}
                    onMessageSent={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}