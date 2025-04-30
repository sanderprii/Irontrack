import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel,
    Box, IconButton, Tooltip, Divider, Typography
} from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import WODSearch from "./WODSearch";
import { getTodayWOD, saveTodayWOD } from "../api/wodApi";
import DOMPurify from 'dompurify'; // You'll need to install this package

export default function WODModal({ open, onClose, selectedDate, selectedAffiliateId, refreshWODs }) {
    const [wod, setWod] = useState({ wodName: "", type: "For Time", description: "", notes: "" });
    const [showSearch, setShowSearch] = useState(true);
    const [selectedColorOption, setSelectedColorOption] = useState(null);
    const wodTypes = ["For Time", "EMOM", "TABATA", "AMRAP"];

    // Color options for formatting
    const colorOptions = [
        { name: "Red", color: "#c62929" },
        { name: "Green", color: "#1a7e1a" },
        { name: "Blue", color: "#3434d6" },
        { name: "Yellow", color: "#a1a166" },
        { name: "Orange", color: "#ffa500" },
        { name: "Purple", color: "#800080" },
    ];

    const loadTodayWOD = useCallback(async () => {
        try {
            const response = await getTodayWOD(selectedAffiliateId, selectedDate);
            if (response) {
                setWod({
                    wodName: response.wodName || "",
                    type: response.type || "For Time",
                    description: response.description || "",
                    notes: response.notes || "",
                    competitionInfo: response.competitionInfo || "",
                });
            } else {
                setWod({ wodName: "", type: "For Time", description: "" });
            }
        } catch (error) {
            console.error("Error loading WOD:", error);
        }
    }, [selectedAffiliateId, selectedDate]);

    useEffect(() => {
        if (open && selectedDate) {
            loadTodayWOD();
            setShowSearch(true);
        }
    }, [open, selectedDate, loadTodayWOD]);

    const handleSaveWOD = async () => {
        try {
            const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

            // Sanitize HTML before saving for both fields
            const sanitizedDescription = DOMPurify.sanitize(wod.description, {
                ALLOWED_TAGS: ['b', 'i', 'span'],
                ALLOWED_ATTR: ['style'],
            });

            const sanitizedCompetitionInfo = DOMPurify.sanitize(wod.competitionInfo, {
                ALLOWED_TAGS: ['b', 'i', 'span'],
                ALLOWED_ATTR: ['style'],
            });

            const wodPayload = {
                affiliateId: selectedAffiliateId,
                wodName: wod.wodName.toUpperCase(),
                wodType: wod.type,
                description: sanitizedDescription,
                date: formattedDate,
                notes: wod.notes,
                competitionInfo: sanitizedCompetitionInfo,
            };

            await saveTodayWOD(selectedAffiliateId, wodPayload);
            loadTodayWOD();
            refreshWODs();
            onClose();
        } catch (error) {
            console.error("❌ Error saving WOD:", error);
        }
    };

    const handleSelectWOD = (selectedWOD) => {
        setWod({
            wodName: selectedWOD.name || "",
            type: selectedWOD.type || "For Time",
            description: selectedWOD.description || "",
        });
        setShowSearch(false);
    };

    const applyFormatting = (formatType, value = null, fieldId) => {
        const textarea = document.getElementById(fieldId);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Valin õige välja stringi vastavalt ID-le
        const fieldContent = fieldId === 'wod-description' ? wod.description : wod.competitionInfo;
        const selectedText = fieldContent.substring(start, end);

        let formattedText = '';

        if (selectedText) {
            switch (formatType) {
                case 'bold':
                    formattedText = `<b>${selectedText}</b>`;
                    break;
                case 'italic':
                    formattedText = `<i>${selectedText}</i>`;
                    break;
                case 'color':
                    formattedText = `<span style="color:${value}">${selectedText}</span>`;
                    break;
                default:
                    formattedText = selectedText;
            }

            const newContent =
                fieldContent.substring(0, start) +
                formattedText +
                fieldContent.substring(end);

            // Uuendan õiget välja vastavalt ID-le
            if (fieldId === 'wod-description') {
                setWod({ ...wod, description: newContent });
            } else {
                setWod({ ...wod, competitionInfo: newContent });
            }

            // Close color menu after selection
            if (formatType === 'color') {
                setSelectedColorOption(null);
            }
        }
    };

// Lisa uus eelvaate komponent competitionInfo välja jaoks
    const CompetitionInfoPreview = () => {
        if (!wod.competitionInfo) return null;

        return (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, maxHeight: '200px', overflow: 'auto' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Competition Info Preview:</Typography>
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(wod.competitionInfo, {
                            ALLOWED_TAGS: ['b', 'i', 'span'],
                            ALLOWED_ATTR: ['style'],
                        })
                    }}
                    style={{
                        whiteSpace: "pre-line" // This preserves line breaks
                    }}
                />
            </Box>
        );
    };

    // Preview component that shows how the formatted text will look
    const DescriptionPreview = () => {
        if (!wod.description) return null;

        return (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, maxHeight: '200px', overflow: 'auto' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Preview:</Typography>
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(wod.description, {
                            ALLOWED_TAGS: ['b', 'i', 'span'],
                            ALLOWED_ATTR: ['style'],
                        })
                    }}
                    style={{
                        whiteSpace: "pre-line" // This preserves line breaks
                    }}
                />
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{wod.wodName ? "Edit WOD" : "Add WOD"}</DialogTitle>
            <DialogContent>
                {showSearch && <WODSearch onSelectWOD={handleSelectWOD} />}
                <TextField
                    label="Notes"
                    fullWidth
                    value={wod.notes}
                    onChange={(e) => setWod({ ...wod, notes: e.target.value })}
                    margin="normal"
                />

                <TextField
                    label="WOD Name"
                    fullWidth
                    value={wod.wodName}
                    onChange={(e) => setWod({ ...wod, wodName: e.target.value })}
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>WOD Type</InputLabel>
                    <Select
                        value={wod.type || "For Time"}
                        onChange={(e) => setWod({ ...wod, type: e.target.value })}
                    >
                        {wodTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Text formatting toolbar */}
                <Box sx={{ mb: 1, mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Formatting:</Typography>
                    <Tooltip title="Bold">
                        <IconButton size="small" onClick={() => applyFormatting('bold', null, 'wod-description')}>
                            <FormatBoldIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                        <IconButton size="small" onClick={() => applyFormatting('italic', null, 'wod-description')}>
                            <FormatItalicIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Color dropdown */}
                    <Box sx={{ position: 'relative' }}>
                        <Tooltip title="Text Color">
                            <IconButton
                                size="small"
                                onClick={() => setSelectedColorOption(prev => prev === 'description' ? null : 'description')}

                            >
                                <FormatColorTextIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {selectedColorOption === 'description' && (
                            <Box sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                zIndex: 1000,
                                width: '200px',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                boxShadow: 3,
                                p: 1
                            }}>
                                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                                    Select color:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {colorOptions.map((option) => (
                                        <Tooltip key={option.name} title={option.name}>
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    backgroundColor: option.color,
                                                    border: '1px solid #888',
                                                    borderRadius: 0.5,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => applyFormatting('color', option.color, 'wod-description')}
                                            />
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>

                <TextareaAutosize
                    id="wod-description"
                    minRows={3}
                    maxRows={10}
                    placeholder="Description (you can format selected text with the tools above)"
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
                    value={wod.description}
                    onChange={(e) => setWod({ ...wod, description: e.target.value })}
                />

                {/* Preview of formatted description */}
                {wod.description && <DescriptionPreview />}

                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        * To format text: Select the text you want to format, then click a formatting button above.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Competition Info:</Typography>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Formatting:</Typography>
                    <Tooltip title="Bold">
                        <IconButton size="small" onClick={() => applyFormatting('bold', null, 'competition-info')}>
                            <FormatBoldIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                        <IconButton size="small" onClick={() => applyFormatting('italic', null, 'competition-info')}>
                            <FormatItalicIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Värvi valikmenüü */}
                    <Box sx={{ position: 'relative' }}>
                        <Tooltip title="Text Color">
                            <IconButton
                                size="small"
                                onClick={() => setSelectedColorOption(prev => prev === 'competition-info' ? null : 'competition-info')}


                            >
                                <FormatColorTextIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {selectedColorOption === 'competition-info' && (
                            <Box sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                zIndex: 1000,
                                width: '200px',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                boxShadow: 3,
                                p: 1
                            }}>
                                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                                    Select color:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {colorOptions.map((option) => (
                                        <Tooltip key={option.name} title={option.name}>
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    backgroundColor: option.color,
                                                    border: '1px solid #888',
                                                    borderRadius: 0.5,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => applyFormatting('color', option.color, 'competition-info')}
                                            />
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
                <TextareaAutosize
                    id="competition-info"
                    minRows={3}
                    maxRows={10}
                    placeholder="Competition Info (you can format selected text with the tools above)"
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
                    value={wod.competitionInfo}
                    onChange={(e) => setWod({ ...wod, competitionInfo: e.target.value })}
                />
                {wod.competitionInfo && <CompetitionInfoPreview />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveWOD} color="primary">Save</Button>
                <Button onClick={onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}