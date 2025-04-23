import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from "@mui/material";

export default function TrainerAssignmentModal({
                                                   open,
                                                   onClose,
                                                   trainers,
                                                   dayClasses,
                                                   selectedTrainer,
                                                   selectedDate,
                                                   selectedClassIds,
                                                   onTrainerChange,
                                                   onDateChange,
                                                   onClassCheckboxChange,
                                                   onAssign
                                               }) {
    // Sort classes by time
    const sortedClasses = dayClasses && dayClasses.length > 0
        ? [...dayClasses].sort((a, b) => new Date(a.time) - new Date(b.time))
        : [];

    // Safely get trainer name
    const getTrainerName = (trainer) => {
        if (!trainer) return "";
        // Check different possible structures
        if (typeof trainer === 'string') return trainer;
        if (trainer.fullName) return trainer.fullName;
        if (trainer.trainer && trainer.trainer.fullName) return trainer.trainer.fullName;
        return "Selected Trainer";
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Assign Trainer to Classes</DialogTitle>
            <DialogContent>
                <Box mb={3} mt={2}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="trainer-select-label">Trainer</InputLabel>
                        <Select
                            labelId="trainer-select-label"
                            id="trainer-select"
                            value={selectedTrainer ? (selectedTrainer.trainerId || selectedTrainer.id || "") : ""}
                            onChange={(e) => onTrainerChange(e.target.value)}
                            label="Trainer"
                        >
                            {Array.isArray(trainers) && trainers.map((trainer) => {
                                // Determine ID and Name based on structure
                                const id = trainer.trainerId || trainer.id || "";
                                const name = getTrainerName(trainer);

                                return (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Box>

                <Box mb={3}>
                    <TextField
                        label="Select Date"
                        type="date"
                        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ""}
                        onChange={(e) => onDateChange(new Date(e.target.value))}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                </Box>

                {sortedClasses.length > 0 ? (
                    <Box>
                        <Typography variant="subtitle1" mb={1}>
                            Select classes to assign {getTrainerName(selectedTrainer)} to:
                        </Typography>
                        <List>
                            {sortedClasses.map((cls) => (
                                <React.Fragment key={cls.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectedClassIds.includes(cls.id)}
                                                onChange={() => onClassCheckboxChange(cls.id)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${new Date(cls.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${cls.trainingName}`}
                                            secondary={cls.trainer ? `Current trainer: ${cls.trainer}` : "No trainer assigned"}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                ) : selectedDate ? (
                    <Typography variant="body1" color="text.secondary" align="center">
                        No classes found for the selected date
                    </Typography>
                ) : (
                    <Typography variant="body1" color="text.secondary" align="center">
                        Please select a date to view classes
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={onAssign}
                    color="primary"
                    variant="contained"
                    disabled={!selectedTrainer || selectedClassIds.length === 0}
                >
                    Assign Trainer
                </Button>
            </DialogActions>
        </Dialog>
    );
}