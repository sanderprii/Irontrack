// src/components/SendMessage.js
import React, { useState, useEffect } from 'react';
import {
    FormControl,
    TextField,
    Button,
    Typography,
    MenuItem,
    Box,
    List,
    ListItem,
    Paper
} from '@mui/material';
import { sendMessage } from '../api/messageApi'; // Funktsioon, mis saadab sõnumi
import { searchUsers } from '../api/membersApi';  // Otsib kasutajaid
import { getGroups } from '../api/groupsApi';
import TextareaAutosize from "@mui/material/TextareaAutosize";     // Toob kõik grupid
// NB! Kontrolli, et teed õiget importi, vastavalt sinu failistruktuurile

export default function SendMessage({ affiliate }) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipientType, setRecipientType] = useState('user'); // 'user' või 'group'
    const [recipient, setRecipient] = useState(''); // Tekst, mida sisestame sisendisse (kas fullName või groupName)
    const [searchResults, setSearchResults] = useState([]); // Otsingutulemused
    const [showDropdown, setShowDropdown] = useState(false); // Kas kuvame dropdowni

    const [selectedUserId, setSelectedUserId] = useState(null); // Kui valime useri, hoiame tema ID
    const [selectedGroupId, setSelectedGroupId] = useState(null); // Kui valime grupi, hoiame tema ID

    const [status, setStatus] = useState('');

    // Kui "recipient" või "recipientType" muutub, teeme otsingu
    useEffect(() => {
        const fetchData = async () => {
            if (recipient.length < 1) {
                // Kui pole midagi sisestatud, peidame dropdowni ja tühjendame tulemused
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            // Alates esimesest tähest proovime otsida
            if (recipientType === 'user') {
                try {
                    const results = await searchUsers(recipient);
                    // Tagastab massiivi: [{ id, fullName }, ...]
                    setSearchResults(results);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('searchUsers error:', error);
                }
            } else {
                // recipientType = 'group'
                try {
                    const groups = await getGroups(affiliate);
                    // getGroups toob kõik grupid. Filtreerime neid sisestuse alusel:
                    const filtered = groups.filter((g) =>
                        g.groupName.toLowerCase().includes(recipient.toLowerCase())
                    );
                    setSearchResults(filtered);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('getGroups error:', error);
                }
            }
        };

        fetchData();
    }, [recipient, recipientType]);

    const handleSend = async (e) => {
        e.preventDefault();
        setStatus('Saatmine...');

        try {
            /**
             * Nüüd pane paika, mida backend tahab:
             *  - senderId -> affiliate.id ? Sinu koodis sõltub, kas affiliate on number/objekt
             *  - Kui recipientType='user', siis kasutame selectedUserId
             *  - Kui recipientType='group', siis kasutame selectedGroupId või groupName
             */
            const payload = {
                senderId: affiliate,     // Kui affiliate on objekt ja tema ID on .id
                subject,
                body,
                recipientType,
            };

            if (recipientType === 'user') {
                payload.recipientId = selectedUserId; // Lõplik user ID
            } else {
                // group
                payload.groupName = recipient;   // Või kui su backend vajab groupId, siis kasuta selectedGroupId
            }

            const responseData = await sendMessage(payload);
            console.log('✅ Email sent:', responseData);
            setStatus('Email saadetud edukalt!');
            // Tühjendame väljad
            setSubject('');
            setBody('');
            setRecipient('');
            setSelectedUserId(null);
            setSelectedGroupId(null);
            setSearchResults([]);
            setShowDropdown(false);
        } catch (error) {
            console.error('❌ Email saatmise viga:', error);
            setStatus('Saatmine nurjus...');
        }
    };

    const handleSelectResult = (item) => {
        // Kui recipientType = user, item on { id, fullName }
        // Kui recipientType = group, item on { id, groupName }
        if (recipientType === 'user') {
            setRecipient(item.fullName);      // Kuvame inputis fullName
            setSelectedUserId(item.id);       // Salvestame user ID
        } else {
            setRecipient(item.groupName);     // Kuvame inputis groupName
            setSelectedGroupId(item.id);      // Grupi ID, kui vaja
        }
        setShowDropdown(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Typography variant="h5" gutterBottom>
                Send Message
            </Typography>

            <form onSubmit={handleSend}>
                {/* Valik: user või group */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        select
                        label="Send to"
                        value={recipientType}
                        onChange={(e) => {
                            setRecipientType(e.target.value);
                            // Resetime pooled asjad, kui tüüp muutub
                            setRecipient('');
                            setSearchResults([]);
                            setSelectedUserId(null);
                            setSelectedGroupId(null);
                            setShowDropdown(false);
                        }}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="group">Group</MenuItem>
                        <MenuItem value="allMembers">All Members</MenuItem>
                    </TextField>
                </FormControl>

                {/* Sisend: kas fullName või groupName otsimiseks */}
                <FormControl fullWidth margin="normal" sx={{ position: 'relative' }}>
                    <TextField
                        label={recipientType === 'user' ? 'Search User by Name' : 'Search Group by Name'}
                        value={recipient}
                        onChange={(e) => {
                            setRecipient(e.target.value);
                        }}
                        helperText={
                            recipientType === 'user'
                                ? "Type a user's name"
                                : 'Type a group name'
                        }
                    />
                    {/* Dropdown, mis avaneb, kui showDropdown=true ja searchResults on saadaval */}
                    {showDropdown && searchResults.length > 0 && (
                        <Paper
                            elevation={3}
                            sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                maxHeight: 200,
                                overflowY: 'auto',
                            }}
                        >
                            <List>
                                {recipientType === 'user'
                                    ? searchResults.map((user) => (
                                        <ListItem
                                            button
                                            key={user.id}
                                            onClick={() => handleSelectResult(user)}
                                        >
                                            {user.fullName}
                                        </ListItem>
                                    ))
                                    : // recipientType = 'group'
                                    searchResults.map((group) => (
                                        <ListItem
                                            button
                                            key={group.id}
                                            onClick={() => handleSelectResult(group)}
                                        >
                                            {group.groupName}
                                        </ListItem>
                                    ))}
                            </List>
                        </Paper>
                    )}
                </FormControl>

                {/* Pealkiri */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </FormControl>

                {/* Sisu (body) - minimaalselt 10 rida, kasvab sisu lisandudes */}
                <FormControl fullWidth margin="normal">
                    <TextareaAutosize
                        multiline
                        minRows={10}
                        maxRows={Infinity}
                        label="Body"
                        variant="outlined"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />



                </FormControl>

                <Button variant="contained" type="submit">
                    Send
                </Button>
            </form>

            {status && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    {status}
                </Typography>
            )}
        </div>
    );
}
