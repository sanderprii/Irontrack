import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminApi } from '../api/adminApi';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, IconButton, TextField, Select, MenuItem, FormControl, InputLabel,
    Button, Typography, Box, Container, CircularProgress, Snackbar, Alert,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {
    Edit as EditIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon
} from '@mui/icons-material';

const Admin = () => {
    const { token: authToken, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Saa token otse localStorage-ist
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isAdmin, setIsAdmin] = useState(false);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editData, setEditData] = useState({});
    const [addingRow, setAddingRow] = useState(false);
    const [newRowData, setNewRowData] = useState({});
    const [requiredFields, setRequiredFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteRowIndex, setDeleteRowIndex] = useState(null);

    // Autentimine ja admin staatuse kontroll
    useEffect(() => {
        const checkAdmin = async () => {
            // Uuendame token'i iga kord, kui hook käivitub
            const currentToken = localStorage.getItem('token') || '';
            setToken(currentToken);

            if (!currentToken || !isLoggedIn) {
                navigate('/login');
                return;
            }

            try {
                const userInfo = await adminApi.checkAdminStatus(currentToken);
                if (userInfo.email !== 'prii.sander@gmail.com') {
                    setIsAdmin(false);
                    navigate('/');
                } else {
                    setIsAdmin(true);
                    fetchTables(currentToken);
                }
            } catch (err) {
                showError('Admin staatuse kontroll ebaõnnestus: ' + err.message);
                navigate('/');
            }
        };

        checkAdmin();
    }, [isLoggedIn, navigate]);

    // Tabelite nimekirja pärimine
    const fetchTables = async (currentToken = token) => {
        try {
            setLoading(true);
            const tablesData = await adminApi.getTables(currentToken);
            setTables(tablesData);
            setLoading(false);
        } catch (err) {
            showError('Tabelite laadimine ebaõnnestus: ' + err.message);
            setLoading(false);
        }
    };

    // Tabeli sisu laadimine
    const loadTableData = async (tableName, pageNum = 0, rowsPerPageParam = rowsPerPage) => {
        setLoading(true);
        setError(null);

        try {
            // Kontrolli, et tableName pole tühi
            if (!tableName) {
                setLoading(false);
                return;
            }

            const result = await adminApi.getTableData(token, tableName, pageNum, rowsPerPageParam);
            setColumns(result.columns || []);
            setData(result.data || []);
            setTotalRows(result.totalRows || 0);
            setRequiredFields(result.requiredFields || []);
            setPage(pageNum);
            setSelectedTable(tableName);
            setEditingRow(null);
            setEditData({});
            setAddingRow(false);
            setNewRowData({});
            setLoading(false);
        } catch (err) {
            showError('Andmete laadimine ebaõnnestus: ' + err.message);
            setLoading(false);
        }
    };

    // Tabeli vahetamine
    const handleTableChange = (e) => {
        const tableName = e.target.value;
        if (tableName) {
            loadTableData(tableName);
        } else {
            setSelectedTable('');
            setColumns([]);
            setData([]);
        }
    };

    // Lehekülje vahetamine
    const handleChangePage = (event, newPage) => {
        loadTableData(selectedTable, newPage, rowsPerPage);
    };

    // Ridade arvu muutmine
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        loadTableData(selectedTable, 0, newRowsPerPage);
    };

    // Redigeerimise alustamine
    const startEditing = (rowIndex) => {
        setEditingRow(rowIndex);
        setEditData({ ...data[rowIndex] });
    };

    // Redigeerimise lõpetamine ja salvestamine
    const saveEdit = async () => {
        try {
            setLoading(true);
            await adminApi.updateRow(token, selectedTable, editData);

            // Uuendame kohalikku andmestikku
            const newData = [...data];
            newData[editingRow] = editData;
            setData(newData);
            setEditingRow(null);
            setEditData({});

            showSuccess('Andmed edukalt salvestatud');
            setLoading(false);
        } catch (err) {
            showError('Andmete salvestamine ebaõnnestus: ' + err.message);
            setLoading(false);
        }
    };

    // Muutuste jälgimine redigeerimise ajal
    const handleEditChange = (column, value) => {
        setEditData(prev => ({ ...prev, [column]: value }));
    };

    // Uue rea lisamine
    const startAddingRow = () => {
        const initialData = {};
        columns.forEach(col => {
            initialData[col] = '';
        });
        setNewRowData(initialData);
        setAddingRow(true);
    };

    // Uue rea salvestamine
    const saveNewRow = async () => {
        try {
            // Kontrollime, et kõik nõutud väljad on täidetud
            const missingFields = requiredFields.filter(field =>
                !newRowData[field] && newRowData[field] !== 0 && newRowData[field] !== false
            );

            if (missingFields.length > 0) {
                showError(`Palun täitke järgmised kohustuslikud väljad: ${missingFields.join(', ')}`);
                return;
            }

            setLoading(true);
            const result = await adminApi.addRow(token, selectedTable, newRowData);

            // Uuendame kohalikku andmestikku, lisades uue rea
            const newData = [...data, result];
            setData(newData);
            setAddingRow(false);
            setNewRowData({});

            showSuccess('Uus rida edukalt lisatud');
            setLoading(false);
        } catch (err) {
            showError('Uue rea lisamine ebaõnnestus: ' + err.message);
            setLoading(false);
        }
    };

    // Muutuste jälgimine uue rea puhul
    const handleNewRowChange = (column, value) => {
        setNewRowData(prev => ({ ...prev, [column]: value }));
    };

    // Rea kustutamisdialoogi avamine
    const openDeleteDialog = (rowIndex) => {
        setDeleteRowIndex(rowIndex);
        setDeleteDialogOpen(true);
    };

    // Rea kustutamine
    const confirmDelete = async () => {
        try {
            setLoading(true);
            const row = data[deleteRowIndex];
            await adminApi.deleteRow(token, selectedTable, row);

            // Uuendame kohalikku andmestikku
            const newData = data.filter((_, index) => index !== deleteRowIndex);
            setData(newData);

            showSuccess('Rida edukalt kustutatud');
            setLoading(false);
        } catch (err) {
            showError('Rea kustutamine ebaõnnestus: ' + err.message);
            setLoading(false);
        } finally {
            setDeleteDialogOpen(false);
            setDeleteRowIndex(null);
        }
    };

    // Andmete värskendamine
    const refreshData = () => {
        if (selectedTable) {
            loadTableData(selectedTable, page, rowsPerPage);
        }
    };

    // Snackbari näitamine
    const showSuccess = (message) => {
        setSnackbarMessage(message);
        setSnackbarSeverity("success");
        setShowSnackbar(true);
    };

    const showError = (message) => {
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setShowSnackbar(true);
        setError(message);
    };

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
    };

    // Otsingu käitlemine
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtreerime andmed otsinguterminiga
    const filteredData = data.filter(row => {
        if (!searchTerm) return true;

        return Object.values(row).some(value =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Kui pole admin või laadimine käib
    if (!isAdmin) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Kontrollin admin staatust...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Andmebaasi Administreerimine
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Vali tabel andmete muutmiseks ja haldamiseks
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
                    <FormControl sx={{ minWidth: 250 }}>
                        <InputLabel id="table-select-label">Vali tabel</InputLabel>
                        <Select
                            labelId="table-select-label"
                            value={selectedTable}
                            label="Vali tabel"
                            onChange={handleTableChange}
                            disabled={loading}
                        >
                            <MenuItem value="">
                                <em>-- Vali tabel --</em>
                            </MenuItem>
                            {tables.map((table, index) => (
                                <MenuItem key={index} value={table}>{table}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedTable && (
                        <>
                            <TextField
                                label="Otsi tabelist"
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                }}
                                sx={{ flexGrow: 1, maxWidth: 300 }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<RefreshIcon />}
                                onClick={refreshData}
                                disabled={loading}
                            >
                                Värskenda
                            </Button>

                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AddIcon />}
                                onClick={startAddingRow}
                                disabled={addingRow || loading || !selectedTable}
                            >
                                Lisa uus rida
                            </Button>
                        </>
                    )}
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {selectedTable && !loading && (
                    <>
                        <TableContainer component={Paper} sx={{ mb: 3, overflow: 'auto', maxHeight: '60vh' }}>
                            <Table stickyHeader aria-label="andmebaasi tabel" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                backgroundColor: '#f5f5f5',
                                                fontWeight: 'bold',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 3,
                                                width: '100px'
                                            }}
                                        >
                                            Tegevused
                                        </TableCell>
                                        {columns.map((column, idx) => (
                                            <TableCell
                                                key={idx}
                                                sx={{
                                                    backgroundColor: '#f5f5f5',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {column}
                                                {requiredFields.includes(column) && (
                                                    <span style={{ color: 'red', marginLeft: '3px' }}>*</span>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.map((row, rowIndex) => (
                                        <TableRow
                                            key={rowIndex}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                                '&:hover': { backgroundColor: '#f1f8e9' }
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    backgroundColor: row.id % 2 === 0 ? '#fafafa' : '#fff',
                                                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {editingRow === rowIndex ? (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={saveEdit}
                                                        disabled={loading}
                                                        size="small"
                                                        title="Salvesta"
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => startEditing(rowIndex)}
                                                        disabled={loading}
                                                        size="small"
                                                        title="Muuda"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    color="error"
                                                    onClick={() => openDeleteDialog(rowIndex)}
                                                    disabled={loading}
                                                    size="small"
                                                    title="Kustuta"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                            {columns.map((column, colIndex) => (
                                                <TableCell key={colIndex}>
                                                    {editingRow === rowIndex ? (
                                                        <TextField
                                                            value={editData[column] !== null ? editData[column] : ''}
                                                            onChange={(e) => handleEditChange(column, e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            variant="outlined"
                                                            error={requiredFields.includes(column) && !editData[column]}
                                                            required={requiredFields.includes(column)}
                                                            disabled={loading}
                                                            type={column === 'password' ? 'password' : 'text'}
                                                        />
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                maxWidth: '200px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                            title={row[column] !== null ? row[column].toString() : ''}
                                                        >
                                                            {row[column] !== null ? (
                                                                column === 'password'
                                                                    ? '••••••••••'
                                                                    : typeof row[column] === 'boolean'
                                                                        ? row[column] ? 'True' : 'False'
                                                                        : row[column].toString()
                                                            ) : 'null'}
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                    {addingRow && (
                                        <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                                            <TableCell
                                                sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    backgroundColor: '#e8f5e9',
                                                    borderRight: '1px solid rgba(224, 224, 224, 1)'
                                                }}
                                            >
                                                <IconButton
                                                    color="primary"
                                                    onClick={saveNewRow}
                                                    disabled={loading}
                                                    size="small"
                                                    title="Salvesta"
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                            </TableCell>
                                            {columns.map((column, colIndex) => (
                                                <TableCell key={colIndex}>
                                                    <TextField
                                                        value={newRowData[column] || ''}
                                                        onChange={(e) => handleNewRowChange(column, e.target.value)}
                                                        size="small"
                                                        fullWidth
                                                        variant="outlined"
                                                        error={requiredFields.includes(column) && !newRowData[column]}
                                                        required={requiredFields.includes(column)}
                                                        disabled={loading}
                                                        placeholder={requiredFields.includes(column) ? "Nõutud" : ""}
                                                        type={column === 'password' ? 'password' : 'text'}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={totalRows}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            labelRowsPerPage="Ridu leheküljel:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count !== -1 ? count : `rohkem kui ${to}`}`}
                        />
                    </>
                )}

                {!selectedTable && !loading && (
                    <Paper sx={{ p: 5, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6" gutterBottom>
                            Palun valige tabel andmete nägemiseks
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Valige ülaltoodud valikust andmebaasi tabel, mida soovite administreerida.
                        </Typography>
                    </Paper>
                )}
            </Paper>

            {/* Snackbar teadete jaoks */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Kustutamise kinnitamise dialoog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Kinnita kustutamine</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kas olete kindel, et soovite selle rea kustutada? Seda tegevust ei saa tagasi võtta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Tühista
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Kustuta
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Admin;