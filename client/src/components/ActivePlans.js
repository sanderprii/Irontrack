// ActivePlans.js
import React, { useState, useEffect } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Typography, Card, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Select, MenuItem, IconButton
} from '@mui/material';
import { getPlans, assignPlanToUser, updateUserPlan } from '../api/planApi';

export default function ActivePlans({ userId, affiliateId }) {
    const [plans, setPlans] = useState([]);          // Kasutaja aktiivsed (UserPlan) kirjed
    const [affiliatePlans, setAffiliatePlans] = useState([]); // Kõik affiliate'i plaanid
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [openModal, setOpenModal] = useState(false);

    // Toome "edit-mode" jaoks
    const [editRowId, setEditRowId] = useState(null); // userPlan.id
    const [editData, setEditData] = useState({
        planName: '',
        price: '',
        sessionsLeft: '',
        endDate: '',
    });

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL;

    // Laeme kasutaja aktiivsed plaanid
    const loadUserActivePlans = () => {
        fetch(`${API_URL}/user/user-purchase-history?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const now = new Date();
                // filtrime välja kehtivad plaanid
                const active = data.filter((p) => new Date(p.endDate) >= now);
                setPlans(active);
            })
            .catch((err) => console.log('Error loading active plans:', err));
    };

    // Esmane laadimine
    useEffect(() => {
        loadUserActivePlans();
    }, [token]);

    // Laeme affiliate'i enda plaanid (Plan tabelist)
    useEffect(() => {
        // Eeldame, et getPlans() tagastab KÕIK plaanid, aga tavaliselt on need ownerId järgi piiritletud
        // kui su backend tekitab role=owner => whereClause.ownerId.
        // Vaatad, kas see sobib su loogikaga.
        getPlans().then((allPlans) => {
            // Filtreerime välja need, mis kuuluvad antud affiliate'ile (ownerId == affiliate's owner?)
            // Või kui plaanil endal on ownerId = userId, see sõltub Sinu loogikast
            const activeAffiliatePlans = allPlans.filter((pl) => pl.active === true);
            setAffiliatePlans(activeAffiliatePlans);
        });
    }, []);

    // Add Plan nupu vajutus -> avab modal
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPlanId('');
    };

    // Modal -> Save -> määrame kasutajale valitud plaani
    const handleSaveModal = async () => {
        if (!selectedPlanId) return;
        await assignPlanToUser(Number(selectedPlanId), Number(userId), affiliateId);
        handleCloseModal();
        // uuesti laeme
        loadUserActivePlans();
    };

    // Edit-nupp -> paneme rida "edit" režiimi
    const handleEdit = (row) => {
        setEditRowId(row.id); // userPlan.id
        setEditData({

            sessionsLeft: row.sessionsLeft || '',
            endDate: row.endDate ? new Date(row.endDate).toISOString().split('T')[0] : '',
        });
    };

    // Kui input muutub
    const handleChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    // Salvestame muudatused
    const handleSaveEdit = async (userPlanId) => {
        // Vaatame, milliseid välju me uuendame
        const body = {

            sessionsLeft: Number(editData.sessionsLeft),
            // Vaatame, kas endDate on string?
            // Teisendame Date vormi, kui vaja
            endDate: editData.endDate ? new Date(editData.endDate) : null,
        };

        await updateUserPlan(userPlanId, body);

        // Lõpetame edit mode
        setEditRowId(null);
        loadUserActivePlans();
    };
  const role = localStorage.getItem('role');
    return (
        <Card sx={{ bgcolor: "background.paper", border: 'none', p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                Active Plans
                {role === 'affiliate' && (
                <Button variant="contained" onClick={handleOpenModal}>
                    Add Plan
                </Button>
                )}
            </Typography>

            {plans.length === 0 ? (
                <Typography>No active plans.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Plan</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Sessions Left</TableCell>
                            <TableCell>Price</TableCell>
                            {role === 'affiliate' && (
                            <TableCell>Edit</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((p) => (
                            <TableRow key={p.id}>
                                {/* Kui see rida on edit-mode */}
                                {editRowId === p.id ? (
                                    <>
                                        <TableCell>{p.planName}</TableCell>
                                        <TableCell>
                                            {new Date(p.purchasedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {/* endDate */}
                                            <TextField
                                                type="date"
                                                size="small"
                                                value={editData.endDate}
                                                onChange={(e) => handleChange('endDate', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={editData.sessionsLeft}
                                                onChange={(e) => handleChange('sessionsLeft', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>{p.price} €</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleSaveEdit(p.id)}>
                                                Save
                                            </Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{p.planName}</TableCell>
                                        <TableCell>{new Date(p.purchasedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(p.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{p.sessionsLeft}</TableCell>
                                        <TableCell>{p.price} €</TableCell>
                                        {role === 'affiliate' && (
                                        <TableCell>
                                            <Button variant="text" onClick={() => handleEdit(p)}>
                                                Edit
                                            </Button>
                                        </TableCell>
                                        )}
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Modal uue plaani lisamiseks (assign to user) */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Assign Plan to User</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    <Typography>Choose one of your affiliate plans:</Typography>
                    <Select
                        fullWidth
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="">-- Please choose --</MenuItem>
                        {affiliatePlans.map((plan) => (
                            <MenuItem key={plan.id} value={plan.id}>
                                {plan.name} (ID: {plan.id})
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveModal} disabled={!selectedPlanId}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
