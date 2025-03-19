// src/components/MessageComponents/GroupsMessage.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    TextField, DialogActions } from '@mui/material';
import { getGroups, createGroup, updateGroup } from '../api/groupsApi';
import { searchUsers } from '../api/membersApi';
// Eeldame, et sul on sellised funktsioonid

export default function GroupsMessage({affiliate}) {
    const [groups, setGroups] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const data = await getGroups(parseInt(affiliate));
            setGroups(data || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleAddGroup = () => {
        // Lisa tühi grupp
        const newGroup = {
            id: null,
            groupName: 'New Group',
            members: [],
        };
        setSelectedGroup(newGroup);
        setOpenDialog(true);
    };

    const handleEditGroup = (group) => {
        setSelectedGroup({ ...group });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedGroup(null);
    };

    const handleSaveGroup = async () => {
        try {
            if (!selectedGroup.id) {
                // createGroup
                await createGroup(selectedGroup, affiliate);
            } else {
                // updateGroup
                await updateGroup(selectedGroup);
            }
            handleCloseDialog();
            fetchGroups();
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    const handleSearchUsers = async () => {
        try {
            const results = await searchUsers(searchQuery);
            setSearchResult(results);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleAddMember = (user) => {
        // Lisa user valitudGroup.members hulka
        if (!selectedGroup.members) {
            selectedGroup.members = [];
        }
        selectedGroup.members.push(user);
        // Force update
        setSelectedGroup({ ...selectedGroup });
    };

    const handleRemoveMember = (userId) => {
        // Filter out the member with the given userId
        const updatedMembers = selectedGroup.members.filter(member => member.id !== userId);
        // Update the selectedGroup state with the new members array
        setSelectedGroup({ ...selectedGroup, members: updatedMembers });
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Groups
            </Typography>
            <Button variant="contained" onClick={handleAddGroup} sx={{ mb: 2 }}>
                Add Group
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Group Name</TableCell>
                            <TableCell>Members count</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.map((group) => (
                            <TableRow key={group.id}>
                                <TableCell>{group.groupName}</TableCell>
                                <TableCell>{group.members?.length || 0}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleEditGroup(group)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for editing/adding group */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>
                    {selectedGroup?.id ? 'Edit Group' : 'Add Group'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Group Name"
                        fullWidth
                        margin="normal"
                        value={selectedGroup?.groupName || ''}
                        onChange={(e) =>
                            setSelectedGroup({ ...selectedGroup, groupName: e.target.value })
                        }
                    />

                    {/* Search bar for adding members */}
                    <TextField
                        label="Search users by fullName"
                        fullWidth
                        margin="normal"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchUsers();
                            }
                        }}
                    />
                    <Button onClick={handleSearchUsers}>Search</Button>

                    {searchResult.map((user) => (
                        <div key={user.id}>
                            {user.fullName}{' '}
                            <Button variant="text" onClick={() => handleAddMember(user)}>
                                + Add
                            </Button>
                        </div>
                    ))}

                    {/* Display currently selected group members */}
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Group Members:
                    </Typography>
                    {selectedGroup?.members?.map((m) => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            {m.fullName}
                            <Button
                                variant="text"
                                color="error"
                                size="small"
                                onClick={() => handleRemoveMember(m.id)}
                                sx={{ ml: 1 }}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveGroup}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
