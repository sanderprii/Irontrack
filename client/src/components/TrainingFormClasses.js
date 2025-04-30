import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, FormControl, FormLabel,
    RadioGroup, FormControlLabel, Radio, TextareaAutosize,
    Box, Typography, IconButton, Tooltip, Divider, Select, InputLabel
} from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import DOMPurify from 'dompurify'; // You'll need to install this package

export default function TrainingModal({ open, onClose, onSave, selectedClass, trainers = [] }) {
    const [trainingData, setTrainingData] = useState({
        trainingType: "WOD", // Default väärtus
        trainingName: "",
        time: "",
        duration: "",
        trainer: "",
        location: "",
        memberCapacity: "",
        repeatWeekly: false, // Default false
        wodName: "",
        wodType: "For Time", // Default väärtus
        description: "",
        canRegister: true,
        freeClass: false,
    });

    // State for text formatting
    const [selectedColorOption, setSelectedColorOption] = useState(null);

    // Color options for formatting
    const colorOptions = [
        { name: "Red", color: "#c62929" },
        { name: "Green", color: "#1a7e1a" },
        { name: "Blue", color: "#3434d6" },
        { name: "Yellow", color: "#a1a166" },
        { name: "Orange", color: "#ffa500" },
        { name: "Purple", color: "#800080" },
    ];

    useEffect(() => {
        if (selectedClass) {
            setTrainingData({
                id: selectedClass.id || "",
                trainingType: selectedClass.trainingType || "WOD",
                trainingName: selectedClass.trainingName || "",
                time: selectedClass.time || "",
                duration: selectedClass.duration || 0,
                trainer: selectedClass.trainer || "",
                location: selectedClass.location || "",
                memberCapacity: selectedClass.memberCapacity || "",
                repeatWeekly: selectedClass.repeatWeekly || false,
                wodName: selectedClass.wodName || "",
                wodType: selectedClass.wodType || "For Time",
                description: selectedClass.description || "",
                canRegister: selectedClass.canRegister || true,
                freeClass: selectedClass.freeClass || false,
                applyToAllFutureTrainings: selectedClass.applyToAllFutureTrainings || false,
            });
        } else {
            setTrainingData({
                trainingType: "WOD",
                trainingName: "",
                time: "",
                duration: "",
                trainer: "",
                location: "",
                memberCapacity: "",
                repeatWeekly: false,
                wodName: "",
                wodType: "NONE",
                description: "",
                canRegister: true,
                freeClass: false,
                applyToAllFutureTrainings: false,
            });
        }
    }, [selectedClass]);

    // Dropdowni valikud - added Rowing and Gymnastics
    const trainingTypes = ["WOD", "Weightlifting", "Cardio", "Rowing", "Gymnastics", "Open Gym", "Kids", "Basic", "Other"];
    const wodTypes = ["For Time", "EMOM", "AMRAP", "TABATA", "For load", "For Quality", "NONE"];

    const formatDateForInput = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // ✅ Lisa null vajadusel (01-12)
        const day = String(date.getDate()).padStart(2, "0"); // ✅ Lisa null vajadusel (01-31)
        const hours = String(date.getHours()).padStart(2, "0"); // ✅ Lisa null (00-23)
        const minutes = String(date.getMinutes()).padStart(2, "0"); // ✅ Lisa null (00-59)

        return `${year}-${month}-${day}T${hours}:${minutes}`; // ✅ Kohalik aeg, mitte UTC!
    };

    const handleChange = (e) => {
        setTrainingData({ ...trainingData, [e.target.name]: e.target.value });
    };

    const handleRadioChange = (e) => {
        setTrainingData({ ...trainingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!trainingData || typeof trainingData !== "object") {
            console.error("❌ Invalid training data before submission:", trainingData);
            return;
        }

        onSave(trainingData);
    };

    // Function to apply formatting to selected text
    const applyFormatting = (formatType, value = null) => {
        const textarea = document.getElementById('wod-description-edit');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = trainingData.description.substring(start, end);

        let formattedText = '';

        if (selectedText) {
            switch (formatType) {
                case 'bold':
                    formattedText = `<b>${selectedText}</b>`;
                    break;
                case 'italic':
                    formattedText = `<i>${selectedText}</i>`;
                    break;
                case 'color':
                    formattedText = `<span style="color:${value}">${selectedText}</span>`;
                    break;
                default:
                    formattedText = selectedText;
            }

            const newDescription =
                trainingData.description.substring(0, start) +
                formattedText +
                trainingData.description.substring(end);

            setTrainingData({ ...trainingData, description: newDescription });

            // Close color menu after selection
            if (formatType === 'color') {
                setSelectedColorOption(null);
            }
        }
    };

    // Preview component that shows how the formatted text will look
    const DescriptionPreview = () => {
        if (!trainingData.description) return null;

        return (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, maxHeight: '200px', overflow: 'auto' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Preview:</Typography>
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(trainingData.description, {
                            ALLOWED_TAGS: ['b', 'i', 'span'],
                            ALLOWED_ATTR: ['style'],
                        })
                    }}
                    style={{
                        whiteSpace: "pre-line" // This preserves line breaks
                    }}
                />
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Training</DialogTitle>
            <DialogContent>
                {/* Training Type Dropdown */}
                <TextField
                    select
                    fullWidth
                    label="Training Type"
                    name="trainingType"
                    value={trainingData.trainingType}
                    onChange={handleChange}
                    margin="dense"
                >
                    {trainingTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    label="Training Name"
                    name="trainingName"
                    value={trainingData.trainingName}
                    onChange={handleChange}
                    margin="dense"
                />

                <TextField
                    fullWidth
                    label="Time"
                    type="datetime-local"
                    name="time"
                    value={formatDateForInput(trainingData.time)}
                    onChange={handleChange}
                    margin="dense"
                />

                <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    name="duration"
                    value={trainingData.duration}
                    onChange={handleChange}
                    margin="dense"
                />

                {/* Trainer dropdown instead of text field */}
                <FormControl fullWidth margin="dense">
                    <InputLabel id="trainer-select-label">Trainer</InputLabel>
                    <Select
                        labelId="trainer-select-label"
                        id="trainer-select"
                        name="trainer"
                        value={trainingData.trainer}
                        onChange={handleChange}
                        label="Trainer"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {trainers.map((trainer) => (
                            <MenuItem key={trainer.trainerId} value={trainer.fullName}>
                                {trainer.fullName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={trainingData.location}
                    onChange={handleChange}
                    margin="dense"
                />

                <TextField
                    fullWidth
                    label="Member Capacity"
                    name="memberCapacity"
                    value={trainingData.memberCapacity}
                    onChange={handleChange}
                    margin="dense"
                />



                {/* Repeat Weekly Radio Buttons */}
                <FormControl component="fieldset" margin="dense" fullWidth>
                    <FormLabel component="legend">Repeat Weekly?</FormLabel>
                    <RadioGroup
                        row
                        name="repeatWeekly"
                        value={trainingData.repeatWeekly.toString()}
                        onChange={(e) => setTrainingData({ ...trainingData, repeatWeekly: e.target.value === "true" })}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" margin="dense" fullWidth>
                    <FormLabel component="legend">Apply to all future trainings?</FormLabel>
                    <RadioGroup
                        row
                        name="applyToAllFutureTraining"
                        value={trainingData.applyToAllFutureTrainings ? "true" : "false"}
                        onChange={(e) => setTrainingData({ ...trainingData, applyToAllFutureTrainings: e.target.value === "true" })}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" margin="dense" fullWidth>
                    <FormLabel component="legend">Can user register for class?</FormLabel>
                    <RadioGroup
                        row
                        name="canRegister"
                        value={trainingData.canRegister.toString()}
                        onChange={(e) => setTrainingData({ ...trainingData, canRegister: e.target.value === "true" })}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" margin="dense" fullWidth>
                    <FormLabel component="legend">Is this class free?</FormLabel>
                    <RadioGroup
                        row
                        name="freeClass"
                        value={trainingData.freeClass.toString()}
                        onChange={(e) => setTrainingData({ ...trainingData, freeClass: e.target.value === "true" })}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
                {/* WOD Type Radio Buttons */}
                <FormControl component="fieldset" margin="dense">
                    <FormLabel component="legend">WOD Type</FormLabel>
                    <RadioGroup
                        row
                        name="wodType"
                        value={trainingData.wodType}
                        onChange={handleRadioChange}
                    >
                        {wodTypes.map((type) => (
                            <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
                        ))}
                    </RadioGroup>
                </FormControl>

                <TextField
                    fullWidth
                    label="WOD Name"
                    name="wodName"
                    value={trainingData.wodName}
                    onChange={handleChange}
                    margin="dense"
                />

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Description</Typography>

                    {/* Text formatting toolbar */}
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>Formatting:</Typography>
                        <Tooltip title="Bold">
                            <IconButton size="small" onClick={() => applyFormatting('bold')}>
                                <FormatBoldIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Italic">
                            <IconButton size="small" onClick={() => applyFormatting('italic')}>
                                <FormatItalicIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Color dropdown */}
                        <Box sx={{ position: 'relative' }}>
                            <Tooltip title="Text Color">
                                <IconButton
                                    size="small"
                                    onClick={() => setSelectedColorOption(prev => prev ? null : true)}
                                >
                                    <FormatColorTextIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            {selectedColorOption && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    zIndex: 1000,
                                    width: '200px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    boxShadow: 3,
                                    p: 1
                                }}>
                                    <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                                        Select color:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {colorOptions.map((option) => (
                                            <Tooltip key={option.name} title={option.name}>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        backgroundColor: option.color,
                                                        border: '1px solid #888',
                                                        borderRadius: 0.5,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => applyFormatting('color', option.color)}
                                                />
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                            Select text and click a formatting button
                        </Typography>
                    </Box>

                    <TextareaAutosize
                        id="wod-description-edit"
                        minRows={3}
                        maxRows={10}
                        placeholder="Description (you can format selected text with the tools above)"
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
                        value={trainingData.description}
                        onChange={(e) => setTrainingData({ ...trainingData, description: e.target.value })}
                        name="description" // Preserved from TextField to ensure handleChange works correctly
                    />

                    {/* Preview of formatted description */}
                    <DescriptionPreview />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="error">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}