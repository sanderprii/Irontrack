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

    // 1) Kui "Add" nuppu vajutatakse => addUserNote => reload
    const handleAddNote = async () => {
        try {
            if (!newNote.trim()) {
                alert("Please enter a note text!");
                return;
            }
            // Kutsume API-t
            await addUserNote(user.id, { note: newNote, flag: newFlag });
            alert("Note added successfully!");
            // 2) Tühjendame väljad
            setNewNote("");
            setNewFlag("red");
            setShowAddNote(false);

            // 3) Laeme uuesti user andmed
            await reloadUserData();
        } catch (error) {
            console.error("Error adding note:", error);
            alert("Failed to add note");
        }
    };

    // 4) reloadUserData - kas sul on parentis funktsioon?
    //   Võid ka parentile callbacki edastada.
    //   Või kui user l laaditakse praegu ProfileModal-is, tee fetch uuesti:
    const reloadUserData = async () => {
        // Ideeliselt saad parentist callbacki vms.
        // Lihtsuse mõttes reloadime lehte:
        // window.location.reload();
        // või kui sul on `getMemberInfo` funktsioon, siis
        // ...
        // Praegu teeme lihtsa variandi:
        window.location.reload();
    };

    // 5) Kui "Delete" nuppu vajutatakse => deleteUserNote => reload
    const handleDeleteNote = async (noteId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this note?")) {
                return;
            }
            // Kutsume API-t
            await deleteUserNote(user.id, noteId);
            alert("Note deleted successfully!");
            // 6) Laeme uuesti user andmed
            await reloadUserData();
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note");
        }
    };


    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={window.innerWidth < 600}
        >
            <DialogTitle>{user.fullName}'s Profile</DialogTitle>
            <DialogContent>
                <ProfileView user={user} />

                <CardContent sx={{ marginTop: 2 }}>
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
                                    onClick={() => handleDeleteNote(notes.id)}
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
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Choose Flag:
                            </Typography>
                            <RadioGroup
                                row
                                value={newFlag}
                                onChange={(e) => setNewFlag(e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <FormControlLabel
                                    value="red"
                                    control={<Radio sx={{ color: "red" }} />}
                                    label="Red"
                                />
                                <FormControlLabel
                                    value="yellow"
                                    control={<Radio sx={{ color: "yellow" }} />}
                                    label="Yellow"
                                />
                                <FormControlLabel
                                    value="green"
                                    control={<Radio sx={{ color: "green" }} />}
                                    label="Green"
                                />
                            </RadioGroup>

                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Note:
                            </Typography>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />

                            <Box sx={{ textAlign: "right", mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleAddNote}
                                    sx={{ mr: 2 }}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
