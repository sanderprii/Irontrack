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
    Paper,
    Chip,
    Stack
} from '@mui/material';
import { sendMessage } from '../api/messageApi'; // Funktsioon, mis saadab sõnumi
import { searchUsers } from '../api/membersApi';  // Otsib kasutajaid
import { getGroups } from '../api/groupsApi';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function SendMessage({ affiliate, affiliateEmail, preSelectedUsers = [], onMessageSent }) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipientType, setRecipientType] = useState('user');
    const [recipient, setRecipient] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(preSelectedUsers || []);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [status, setStatus] = useState('');

    // Quill editor modules and formats configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet',
        'align',
        'link'
    ];

    // Initialize with preSelectedUsers if provided
    useEffect(() => {
        if (preSelectedUsers && preSelectedUsers.length > 0) {
            setSelectedUsers(preSelectedUsers);
            setRecipientType('user');
        }
    }, [preSelectedUsers]);

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
        setStatus('Sending...');

        try {
            if (recipientType === 'user' && selectedUsers.length > 0) {
                // Send to each selected user
                for (const user of selectedUsers) {
                    const payload = {
                        senderId: affiliate,
                        subject,
                        body, // Rich HTML body will be sent as is
                        recipientType: 'user',
                        affiliateEmail,
                        recipientId: user.id
                    };

                    await sendMessage(payload);
                }

                setStatus(`Email successfully sent to ${selectedUsers.length} recipients!`);
            } else if (recipientType === 'group' || recipientType === 'allMembers') {
                // Original logic for groups and all members
                const payload = {
                    senderId: affiliate,
                    subject,
                    body, // Rich HTML body
                    recipientType,
                    affiliateEmail,
                };

                if (recipientType === 'group') {
                    payload.groupName = recipient;
                }

                await sendMessage(payload);
                setStatus('Email sent successfully!');
            } else {
                setStatus('Please select at least one recipient!');
                return;
            }

            // Tühjendame väljad
            setSubject('');
            setBody('');
            setRecipient('');
            setSelectedUsers([]);
            setSelectedGroupId(null);
            setSearchResults([]);
            setShowDropdown(false);

            // Call onMessageSent callback if provided
            if (onMessageSent) {
                onMessageSent();
            }
        } catch (error) {
            console.error('❌ Email saatmise viga:', error);
            setStatus('Sending failed...');
        }
    };

    const handleSelectResult = (item) => {
        if (recipientType === 'user') {
            // Check if user is already in the selected users list
            if (!selectedUsers.some(user => user.id === item.id)) {
                setSelectedUsers([...selectedUsers, item]);
            }
            // Clear the search input and results
            setRecipient('');
            setSearchResults([]);
        } else {
            setRecipient(item.groupName);     // Kuvame inputis groupName
            setSelectedGroupId(item.id);      // Grupi ID, kui vaja
        }
        setShowDropdown(false);
    };

    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
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
                            setSelectedUsers([]);
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

                {/* Display selected users as chips when recipientType is 'user' */}
                {recipientType === 'user' && selectedUsers.length > 0 && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Selected Recipients:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {selectedUsers.map((user) => (
                                <Chip
                                    key={user.id}
                                    label={user.fullName}
                                    onDelete={() => handleRemoveUser(user.id)}
                                    sx={{ margin: '3px' }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Pealkiri */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </FormControl>

                {/* Rich Text Editor for body */}
                <FormControl fullWidth margin="normal">
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Message Body
                    </Typography>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '16px' }}>
                        <ReactQuill
                            theme="snow"
                            value={body}
                            onChange={setBody}
                            modules={modules}
                            formats={formats}
                            style={{ height: '250px', marginBottom: '40px' }}
                        />
                    </div>
                </FormControl>

                <Button
                    variant="contained"
                    type="submit"
                    disabled={
                        (recipientType === 'user' && selectedUsers.length === 0) ||
                        (recipientType === 'group' && !recipient) ||
                        !subject ||
                        !body
                    }
                >
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