import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, FormHelperText } from '@mui/material';

export default function ProfileEdit({ user, onSave, onCancel }) {
    const [draft, setDraft] = useState(user);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Check fullName is not empty
        if (!draft.fullName || draft.fullName.trim() === '') {
            newErrors.fullName = 'Full name is required';
        }

        // Check phone is not empty
        if (!draft.phone || draft.phone.trim() === '') {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);

        // Form is valid if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDraft({ ...draft, [name]: value });

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(draft);
        }
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
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
            />

            <TextField
                label="Phone"
                name="phone"
                value={draft.phone || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
                required
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

            <Button
                variant="contained"
                onClick={handleSubmit}
            >
                Save
            </Button>

            <Button
                variant="outlined"
                color="error"
                onClick={onCancel}
                sx={{ ml: 2 }}
            >
                Cancel
            </Button>
        </Box>
    );
}