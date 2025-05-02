import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function ProfileEdit({ user, onSave, onCancel }) {
    const [draft, setDraft] = useState(user);

    const handleChange = (e) => {
        setDraft({ ...draft, [e.target.name]: e.target.value });
    };

    return (
        <Box>
            <TextField
                label="Full Name"
                name="fullName"
                value={draft.fullName || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
                fullWidth
            />

            <TextField
                label="Phone"
                name="phone"
                value={draft.phone || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
                fullWidth
            />
            <TextField
                label="Emergency Contact"
                name="emergencyContact"
                value={draft.emergencyContact || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
                fullWidth
            />
            <TextField
                label="Address"
                name="address"
                value={draft.address || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
                fullWidth
            />
            <TextField
                type="date"
                label="Birthdate"
                name="dateOfBirth"
                value={draft.dateOfBirth ? draft.dateOfBirth.substr(0,10) : ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
                fullWidth
                InputLabelProps={{ shrink: true }}
            />



            <Button variant="contained" onClick={() => onSave(draft)}>
                Save
            </Button>
            <Button variant="outlined" color="error" onClick={onCancel} sx={{ ml: 2 }}>
                Cancel
            </Button>
        </Box>
    );
}
