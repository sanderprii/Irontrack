import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,

} from "@mui/material";


import ProfileView from "./ProfileView";


export default function ProfileModal({ open, onClose, user }) {
    if (!user) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={window.innerWidth < 600}
        >
            <DialogTitle>{user.fullName}'s Profile</DialogTitle>
            <DialogContent sx={{ p: 0, m: 0 }}>
                <ProfileView user={user} />


            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
