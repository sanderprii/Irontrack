import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

export default function PlanFormModal({ open, onClose, onSave, plan }) {
    const [form, setForm] = useState({
        name: "",
        validityDays: "",
        price: "",
        sessions: "",
        additionalData: "",
        trainingType: [] // Initialize trainingType as an empty array
    });

    // Function to ensure training types are always in array format
    const parseTrainingType = (trainingType) => {
        if (!trainingType) return [];

        if (Array.isArray(trainingType)) return trainingType;

        // If it's a string that looks like JSON, try to parse it
        if (typeof trainingType === 'string') {
            try {
                const parsed = JSON.parse(trainingType);
                return Array.isArray(parsed) ? parsed : [trainingType];
            } catch (e) {
                // If JSON.parse fails, return the original string as a single-element array
                return [trainingType];
            }
        }

        // All other cases - return as a single-element array
        return [trainingType];
    };

    useEffect(() => {
        if (plan) {
            // Process the plan to ensure trainingType is definitely an array
            const updatedPlan = {
                ...plan,
                trainingType: parseTrainingType(plan.trainingType)
            };
            setForm(updatedPlan);
        } else {
            setForm({
                name: "",
                validityDays: "",
                price: "",
                sessions: "",
                additionalData: "",
                trainingType: []
            });
        }
    }, [plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setForm({ ...form, sessions: e.target.checked ? 9999 : "" });
    };

    const handleSubmit = () => {
        // No need to process trainingType separately here,
        // it's handled in the API layer
        onSave(form);
    };

    console.log("Current form trainingType:", form.trainingType); // For debugging

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{plan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Training Types"
                    name="trainingType"
                    fullWidth
                    margin="normal"
                    value={form.trainingType || []}
                    onChange={handleChange}
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) => selected.join(', ')
                    }}
                    helperText="Select one or more training types"
                >
                    <MenuItem value="All classes">ALL CLASSES</MenuItem>
                    <MenuItem value="WOD">WOD</MenuItem>
                    <MenuItem value="Weightlifting">Weightlifting</MenuItem>
                    <MenuItem value="Cardio">Cardio</MenuItem>
                    <MenuItem value="Rowing">Rowing</MenuItem>
                    <MenuItem value="Gymnastics">Gymnastics</MenuItem>
                    <MenuItem value="Open Gym">Open Gym</MenuItem>
                </TextField>
                <TextField
                    label="Plan Name"
                    name="name"
                    fullWidth
                    margin="normal"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Validity Period (Days)"
                    name="validityDays"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={form.validityDays}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Price (€)"
                    name="price"
                    type="number"
                    step="0.01"
                    fullWidth
                    margin="normal"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Number of Sessions"
                    name="sessions"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={form.sessions}
                    onChange={handleChange}
                    disabled={form.sessions === 9999}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.sessions === 9999}
                            onChange={handleCheckboxChange}
                        />
                    }
                    label="Unlimited Sessions"
                />
                <TextField
                    label="Additional Information"
                    name="additionalData"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    value={form.additionalData}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                {plan && (
                    <Button
                        color="error"
                        onClick={() => onSave(null)}
                        sx={{ mr: 'auto' }}
                    >
                        Delete
                    </Button>
                )}
                <Button onClick={onClose} color="secondary">Close</Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={!form.name || !form.validityDays || form.price === "" || (form.sessions === "" && form.sessions !== 9999)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}