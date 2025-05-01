import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    useTheme,
    useMediaQuery,
    Button
} from '@mui/material';
import { Close as CloseIcon, PercentOutlined as PercentIcon } from '@mui/icons-material';

const WeightliftingPercentageCalculator = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Generate weight values from 45 to 250 in increments of 5
    const weights = Array.from({ length: 42 }, (_, i) => 45 + i * 5);

    // Generate percentage values from 100% to 50% in decrements of 5%
    const percentages = Array.from({ length: 11 }, (_, i) => 100 - i * 5);

    // Calculate the weight for a given percentage
    const calculateWeight = (weight, percentage) => {
        const calculated = (weight * percentage) / 100;
        return calculated.toFixed(1);
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    borderRadius: '4px',
                    color: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                }}
            >
                <PercentIcon />
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 1
                }}>
                    <Typography variant="h6" component="div" fontWeight="medium">
                        Weightlifting Percentages Calculator
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            maxHeight: '75vh',
                            overflow: 'auto',
                            '& .MuiTableCell-root': {
                                padding: '8px 12px',
                                fontSize: isMobile ? '0.75rem' : '0.875rem',
                            }
                        }}
                    >
                        <Table stickyHeader size={isMobile ? "small" : "medium"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 3,
                                            width: '80px'
                                        }}
                                    >
                                        1RM
                                    </TableCell>
                                    {percentages.map(percentage => (
                                        <TableCell
                                            key={percentage}
                                            align="center"
                                            sx={{
                                                backgroundColor: theme.palette.primary.main,
                                                color: 'white',
                                                fontWeight: 'bold',
                                                minWidth: '55px'
                                            }}
                                        >
                                            {percentage}%
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weights.map(weight => (
                                    <TableRow
                                        key={weight}
                                        sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{
                                                backgroundColor: theme.palette.grey[100],
                                                fontWeight: 'bold',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 1,
                                                borderRight: '2px solid',
                                                borderRightColor: theme.palette.divider
                                            }}
                                        >
                                            {weight}
                                        </TableCell>
                                        {percentages.map(percentage => (
                                            <TableCell key={`${weight}-${percentage}`} align="center">
                                                {calculateWeight(weight, percentage)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WeightliftingPercentageCalculator;