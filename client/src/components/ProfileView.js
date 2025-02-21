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
    FormControlLabel, Radio, TextField, IconButton,

} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';


import {addUserNote, deleteUserNote} from "../api/profileApi";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProfileView({user, onEditProfile, onChangePassword, onUploadProfilePicture}) {

    const [showAddNote, setShowAddNote] = useState(false);
    const [newFlag, setNewFlag] = useState("red"); // Vaikimisi "red"
    const [newNote, setNewNote] = useState("");

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

    const role = localStorage.getItem("role");

    return (

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
                        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                            Upload Profile Picture
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1} sx={{ textAlign: 'left' }}>
                            {/* Nimi */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PersonIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.fullName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <EmailIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.email}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PhoneAndroidIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.phone}
                                </Typography>
                            </Box>

                            {/* Aadress */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <LocationOnIcon sx={{ color: "gray" }} />
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

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1} sx={{ textAlign: 'left' }}>
                            {/* Nimi */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PersonIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.fullName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <EmailIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.email}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PhoneAndroidIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.phone}
                                </Typography>
                            </Box>
                            {/* Aadress */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <LocationOnIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.address}
                                </Typography>
                            </Box>
                        </Stack>
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

                    </>
                )}
        </CardContent>

)
    ;
}
