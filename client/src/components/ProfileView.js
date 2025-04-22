import React, {useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
    Box,
    Divider,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';

import {addUserNote, deleteUserNote} from "../api/profileApi";
import DeleteIcon from "@mui/icons-material/Delete";
import TextareaAutosize from "@mui/material/TextareaAutosize";

export default function ProfileView({user, onEditProfile, onChangePassword, onUploadProfilePicture}) {

    const [showAddNote, setShowAddNote] = useState(false);
    const [newFlag, setNewFlag] = useState("red"); // Vaikimisi "red"
    const [newNote, setNewNote] = useState("");

    // Dialog states
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [noteToDelete, setNoteToDelete] = useState(null);

    // Helper function to format date as DD.MM.YYYY
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle empty dates

        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) return dateString;

        // Format to DD.MM.YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onUploadProfilePicture(file);
        }
    };

    const reloadUserData = async () => {
        // Ideeliselt saad parentist callbacki vms.
        // Lihtsuse mõttes reloadime lehte:
        // window.location.reload();
        // või kui sul on `getMemberInfo` funktsioon, siis
        // ...
        // Praegu teeme lihtsa variandi:
        window.location.reload();
    };

    // Show success message
    const showSuccessMessage = (message) => {
        setDialogMessage(message);
        setSuccessDialogOpen(true);
    };

    // Show error message
    const showErrorMessage = (message) => {
        setDialogMessage(message);
        setErrorDialogOpen(true);
    };

    const handleAddNote = async () => {
        try {
            if (!newNote.trim()) {
                showErrorMessage("Please enter a note text!");
                return;
            }
            // Kutsume API-t
            await addUserNote(user.id, {note: newNote, flag: newFlag});
            showSuccessMessage("Note added successfully!");
            // 2) Tühjendame väljad
            setNewNote("");
            setNewFlag("red");
            setShowAddNote(false);

            // 3) Laeme uuesti user andmed
            await reloadUserData();
        } catch (error) {
            console.error("Error adding note:", error);
            showErrorMessage("Failed to add note");
        }
    };

    // Open delete confirmation dialog
    const handleOpenDeleteConfirm = (noteId) => {
        setNoteToDelete(noteId);
        setConfirmDialogOpen(true);
    };

    // 5) Kui "Delete" nuppu vajutatakse => deleteUserNote => reload
    const handleDeleteNote = async () => {
        try {
            if (!noteToDelete) return;

            // Kutsume API-t
            await deleteUserNote(user.id, noteToDelete);
            showSuccessMessage("Note deleted successfully!");
            setConfirmDialogOpen(false);
            // 6) Laeme uuesti user andmed
            await reloadUserData();
        } catch (error) {
            console.error("Error deleting note:", error);
            showErrorMessage("Failed to delete note");
        }
    };

    const role = localStorage.getItem("role");

    return (
        <>
            <CardContent sx={{textAlign: 'center', p: 3}}>
                {role === "regular" ? (
                    <>
                        <Avatar
                            src={user?.logo || "https://via.placeholder.com/120"}
                            sx={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%', // Muudab profiilipildi ringiks
                                objectFit: 'cover',
                                margin: 'auto',
                            }}
                        />
                        <Button variant="outlined" component="label" sx={{mt: 2}}>
                            Upload Profile Picture
                            <input type="file" accept="image/*" hidden onChange={handleFileChange}/>
                        </Button>
                        <Divider sx={{my: 2}}/>

                        <Stack spacing={1} sx={{textAlign: 'left'}}>
                            {/* Nimi */}
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PersonIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.fullName}
                                </Typography>
                            </Box>
                            {/* dateOfBirth - now formatted */}
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PersonIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {formatDate(user.dateOfBirth)}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <EmailIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.email}
                                </Typography>
                            </Box>

                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PhoneAndroidIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.phone}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PhoneAndroidIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong>SOS: </strong> {user.emergencyContact}
                                </Typography>
                            </Box>
                            {/* Aadress */}
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <LocationOnIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.address}
                                </Typography>
                            </Box>
                        </Stack>


                    </>
                ) : (
                    <>
                        <Avatar
                            src={user?.logo || "https://via.placeholder.com/120"}
                            sx={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%', // Muudab profiilipildi ringiks
                                objectFit: 'cover',
                                margin: 'auto',
                            }}
                        />

                        <Divider sx={{my: 2}}/>

                        <Stack spacing={1} sx={{textAlign: 'left'}}>
                            {/* Nimi */}
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PersonIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.fullName}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PersonIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {formatDate(user.dateOfBirth)}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <EmailIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.email}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PhoneAndroidIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.phone}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <PhoneAndroidIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong>SOS: </strong> {user.emergencyContact}
                                </Typography>
                            </Box>
                            {/* Aadress */}
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                                <LocationOnIcon sx={{color: "gray"}}/>
                                <Typography>
                                    <strong></strong> {user.address}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                                width: '100%',
                                height: '20px',
                                backgroundColor: user.isAcceptedTerms ? 'success.light' : 'error.light',
                                borderRadius: '4px',
                                px: 1
                            }}>
                                <Box
                                    sx={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: user.isAcceptedTerms ? 'success.main' : 'error.main'
                                    }}
                                />
                                <Typography variant="body2" sx={{color: 'text.primary'}}>
                                    <strong>{user.isAcceptedTerms ? "Accepted Terms" : "Terms not accepted"}</strong>
                                </Typography>
                            </Box>


                        </Stack>
                        <CardContent sx={{marginTop: 2}}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1
                                }}
                            >
                                <Typography variant="h6">User Notes</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowAddNote(!showAddNote)}
                                >
                                    + Add Note
                                </Button>
                            </Box>

                            {user.userNotes.map((notes) => (
                                <Card
                                    key={notes.id}
                                    sx={{
                                        marginTop: 1,
                                        backgroundColor:
                                            notes.flag === "red"
                                                ? "rgba(255, 0, 0, 0.1)"
                                                : notes.flag === "yellow"
                                                    ? "rgba(255, 255, 0, 0.1)"
                                                    : notes.flag === "green"
                                                        ? "rgba(0, 255, 0, 0.1)"
                                                        : "inherit"
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body1">{notes.note}</Typography>

                                    </CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center"

                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleOpenDeleteConfirm(notes.id)}
                                            size={"small"}
                                            sx={{
                                                backgroundColor: "red",
                                                color: "white",

                                                "&:hover": {
                                                    backgroundColor: "darkred",
                                                },
                                            }}
                                        >
                                            <DeleteIcon/>

                                        </IconButton>
                                    </Box>
                                </Card>
                            ))}

                            {/* Uue märkme vorm */}
                            {showAddNote && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        border: "1px solid #ccc",
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{mb: 1}}>
                                        Choose Flag:
                                    </Typography>
                                    <RadioGroup
                                        row
                                        value={newFlag}
                                        onChange={(e) => setNewFlag(e.target.value)}
                                        sx={{mb: 2}}
                                    >
                                        <FormControlLabel
                                            value="red"
                                            control={<Radio sx={{color: "red"}}/>}
                                            label="Red"
                                        />
                                        <FormControlLabel
                                            value="yellow"
                                            control={<Radio sx={{color: "yellow"}}/>}
                                            label="Yellow"
                                        />
                                        <FormControlLabel
                                            value="green"
                                            control={<Radio sx={{color: "green"}}/>}
                                            label="Green"
                                        />
                                    </RadioGroup>

                                    <Typography variant="subtitle1" sx={{mb: 1}}>
                                        Note:
                                    </Typography>
                                    <FormControl fullWidth>
                                        <TextareaAutosize
                                            minRows={3}
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
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
                                        />
                                    </FormControl>
                                    <Box sx={{textAlign: "right", mt: 2}}>
                                        <Button
                                            variant="contained"
                                            onClick={handleAddNote}
                                            sx={{mr: 2}}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => setShowAddNote(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>

                    </>
                )}
            </CardContent>

            {/* Success Dialog */}
            <Dialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
            >
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Dialog */}
            <Dialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
            >
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this note? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteNote} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}