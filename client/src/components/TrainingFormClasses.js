import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, FormControl, FormLabel,
    RadioGroup, FormControlLabel, Radio, TextareaAutosize
} from "@mui/material";

export default function TrainingModal({ open, onClose, onSave, selectedClass }) {
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
                wodType: "For Time",
                description: "",
                canRegister: true,
                freeClass: false,
            });
        }
    }, [selectedClass]);

    // Dropdowni valikud - added Rowing and Gymnastics
    const trainingTypes = ["WOD", "Weightlifting", "Cardio", "Rowing", "Gymnastics", "Open Gym", "Other"];
    const wodTypes = ["For Time", "EMOM", "AMRAP", "TABATA"];

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

                <TextField
                    fullWidth
                    label="Trainer"
                    name="trainer"
                    value={trainingData.trainer}
                    onChange={handleChange}
                    margin="dense"
                />

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

                <TextareaAutosize
                    minRows={3}
                    maxRows={10}
                    placeholder="Description"
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
                    onChange={handleChange}
                    name="description" // Preserved from TextField to ensure handleChange works correctly
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
                        onChange={(e) => setTrainingData({ ...trainingData, freeClass: e.target.value === "false" })}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

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