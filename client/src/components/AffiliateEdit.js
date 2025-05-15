import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    IconButton,
    FormHelperText,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { searchTrainers } from "../api/affiliateApi";

export default function AffiliateEdit({ affiliate, trainers, onSave, onCancel }) {
    const [form, setForm] = useState({ ...affiliate });
    const [selectedTrainers, setSelectedTrainers] = useState([...trainers]);
    const [trainerSearch, setTrainerSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Training options
    const trainingOptions = [
        'All classes',
        'WOD',
        'Weightlifting',
        'Rowing',
        'Gymnastics',
        'Open Gym',
        'Cardio',
        'Kids',
        'Basic',
        'Other'
    ];

    // Parse existing freeFirstTrainingList and set as initial state
    const [selectedTrainings, setSelectedTrainings] = useState(
        (() => {
            if (!affiliate.freeFirstTrainingList) return [];

            try {
                // If it's already an array, return it
                if (Array.isArray(affiliate.freeFirstTrainingList)) {
                    return affiliate.freeFirstTrainingList;
                }

                // If it's a string, try to parse it
                if (typeof affiliate.freeFirstTrainingList === 'string') {
                    return JSON.parse(affiliate.freeFirstTrainingList);
                }

                return [];
            } catch (error) {
                console.error('Error parsing freeFirstTrainingList:', error);
                return [];
            }
        })()
    );

    // Add errors state to track validation errors
    const [errors, setErrors] = useState({
        name: false,
        address: false,
        trainingType: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear error for this field when user types something
        if (errors[name]) {
            setErrors({ ...errors, [name]: false });
        }
    };

    // Handle training checkbox changes
    const handleTrainingChange = (trainingType) => {
        setSelectedTrainings(prev => {
            if (prev.includes(trainingType)) {
                return prev.filter(t => t !== trainingType);
            } else {
                return [...prev, trainingType];
            }
        });
    };

    const handleRemoveTrainer = (trainerId) => {
        setSelectedTrainers(selectedTrainers.filter((t) => t.trainerId !== trainerId));
    };

    const handleTrainerSearch = async (e) => {
        const query = e.target.value;
        setTrainerSearch(query);

        if (query.length > 2) {
            const results = await searchTrainers(query);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectTrainer = (trainer) => {
        if (!selectedTrainers.some((t) => t.trainerId === trainer.id)) {
            setSelectedTrainers([...selectedTrainers, { trainerId: trainer.id, fullName: trainer.fullName, username: trainer.username }]);
        }
        setTrainerSearch("");
        setSearchResults([]);
    };

    // Function to validate the form
    const validateForm = () => {
        const newErrors = {
            name: !form.name,
            address: !form.address,
            trainingType: !form.trainingType
        };

        setErrors(newErrors);

        // Form is valid if no errors (all required fields are filled)
        return !Object.values(newErrors).some(error => error);
    };

    const handleSave = () => {
        // Validate the form before submission
        const isValid = validateForm();

        if (isValid) {

            let websiteValue = form.website || '';

            // Kui väli pole tühi ja ei alga http:// või https:// eesliitega
            if (websiteValue && !websiteValue.match(/^https?:\/\//)) {
                websiteValue = 'https://' + websiteValue;
            }

            const updatedForm = {
                ...form,
                id: form.id || affiliate.id, // Kasuta ID-d, mis saadi `MyAffiliate.js` kaudu
                website: websiteValue,
                freeFirstTrainingList: JSON.stringify(selectedTrainings), // Convert to JSON string for backend
                trainers: selectedTrainers.map(trainer => ({
                    trainerId: trainer.trainerId,
                    fullName: trainer.fullName,
                    username: trainer.username
                })) // ✅ Lisa treenerid `updatedForm` objekti
            };

            onSave(updatedForm);
        }
        // If not valid, the errors will be displayed and form won't submit
    };

    return (
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3, bgcolor: "background.paper" }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit Affiliate</Typography>

                <TextField
                    label="Affiliate Name*"
                    name="name"
                    fullWidth
                    margin="normal"
                    value={form.name || ''}
                    onChange={handleChange}
                    error={errors.name}
                    helperText={errors.name ? "Affiliate name is required" : ""}
                />

                <TextField
                    label="Address*"
                    name="address"
                    fullWidth
                    margin="normal"
                    value={form.address || ''}
                    onChange={handleChange}
                    error={errors.address}
                    helperText={errors.address ? "Address is required" : ""}
                />

                <TextField
                    label="Training Type*"
                    name="trainingType"
                    fullWidth
                    margin="normal"
                    value={form.trainingType || ''}
                    onChange={handleChange}
                    error={errors.trainingType}
                    helperText={errors.trainingType ? "Training type is required" : ""}
                />

                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={form.email || ''}
                    onChange={handleChange}
                />

                <TextField
                    label="Website"
                    name="website"
                    fullWidth
                    margin="normal"
                    value={form.website || ''}
                    onChange={handleChange}
                />

                <TextField
                    label="Feedback link"
                    name="feedback"
                    fullWidth
                    margin="normal"
                    value={form.feedback || ''}
                    onChange={handleChange}
                />

                <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    margin="normal"
                    value={form.phone || ''}
                    onChange={handleChange}
                />

                <TextField
                    label="IBAN"
                    name="iban"
                    fullWidth
                    margin="normal"
                    value={form.iban || ''}
                    onChange={handleChange}
                />

                <TextField
                    label="Bank Name"
                    name="bankName"
                    fullWidth
                    margin="normal"
                    value={form.bankName || ''}
                    onChange={handleChange}
                />

                <TextField
                    label="Payment Holiday Fee"
                    name="paymentHolidayFee"
                    fullWidth
                    margin="normal"
                    value={form.paymentHolidayFee || ''}
                    onChange={handleChange}
                />

                {/* Free First Training Selection */}
                <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Free First Training Options
                    </Typography>
                    <FormGroup>
                        {trainingOptions.map((training) => (
                            <FormControlLabel
                                key={training}
                                control={
                                    <Checkbox
                                        checked={selectedTrainings.includes(training)}
                                        onChange={() => handleTrainingChange(training)}
                                        name={training}
                                    />
                                }
                                label={training}
                            />
                        ))}
                    </FormGroup>
                </Box>

                <Typography variant="h6" sx={{ mt: 2 }}>Search Trainers</Typography>
                <TextField label="Search" fullWidth value={trainerSearch} onChange={handleTrainerSearch} />
                <List>
                    {searchResults.map((trainer) => (
                        <ListItem key={trainer.id} button onClick={() => handleSelectTrainer(trainer)}>
                            {trainer.fullName}
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6" sx={{ mt: 2 }}>Selected Trainers</Typography>
                <List>
                    {selectedTrainers.map((trainer) => (
                        <ListItem key={trainer.trainerId} secondaryAction={
                            <IconButton edge="end" onClick={() => handleRemoveTrainer(trainer.trainerId)}>
                                <DeleteIcon />
                            </IconButton>
                        }>
                            {trainer.fullName}
                        </ListItem>
                    ))}
                </List>

                <FormHelperText sx={{ mb: 2 }}>
                    * Required fields
                </FormHelperText>

                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>Save</Button>
                <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ mt: 2, ml: 2 }}>Cancel</Button>
            </CardContent>
        </Card>
    );
}