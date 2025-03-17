import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const RecordEditModal = ({ open, onClose, record, recordType, onSave }) => {
    // Create state for edited values
    const [date, setDate] = useState(record ? record.fullDate?.substring(0, 10) : '');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Set initial value based on record type
    React.useEffect(() => {
        if (record) {
            if (recordType === 'Weightlifting') {
                setValue(record.weight || '');
            } else if (recordType === 'Cardio') {
                setValue(record.time || '');
            } else {
                // WOD
                setValue(record.score || '');
            }
        }
    }, [record, recordType]);

    // Handle save function
    const handleSave = async () => {
        try {
            setError('');
            setLoading(true);

            // Validate input
            if (!date) {
                setError('Date is required');
                return;
            }

            if (!value) {
                setError(`${recordType === 'Weightlifting' ? 'Weight' : recordType === 'Cardio' ? 'Time' : 'Score'} is required`);
                return;
            }

            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL;

            // Prepare payload based on record type
            const payload = {
                id: record.id,
                date: new Date(date).toISOString()
            };

            if (recordType === 'Weightlifting') {
                payload.weight = parseFloat(value);
            } else if (recordType === 'Cardio') {
                payload.time = value;
            } else {
                // WOD
                payload.score = value;
            }

            // Call API to update the record
            const response = await fetch(`${baseUrl}/records/${record.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update record');
            }

            // Call parent callback
            if (onSave) {
                onSave();
            }

            onClose();
        } catch (err) {
            setError(err.message || 'An error occurred while updating the record');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Edit Record</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                {recordType === 'Weightlifting' && (
                    <TextField
                        label="Weight (kg)"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: <Typography color="text.secondary">kg</Typography>
                        }}
                    />
                )}

                {recordType === 'Cardio' && (
                    <TextField
                        label="Time"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="mm:ss"
                        helperText="Format: minutes:seconds (e.g. 3:45)"
                    />
                )}

                {recordType === 'WOD' && (
                    <TextField
                        label="Score"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter score"
                        helperText="For example: number of rounds, reps, etc."
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    disabled={loading}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecordEditModal;