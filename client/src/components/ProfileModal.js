import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Avatar,
    CardContent,
    Typography,
    Card,
    Box,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ProfileView from "./ProfileView";
import { addUserNote, deleteUserNote } from "../api/profileApi";

export default function ProfileModal({ open, onClose, user }) {
    const [showAddNote, setShowAddNote] = useState(false);
    const [newFlag, setNewFlag] = useState("red"); // Vaikimisi "red"
    const [newNote, setNewNote] = useState("");

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
