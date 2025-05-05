// src/components/Statistics.js
import React, { useEffect, useState } from 'react';
import { getStatistics } from '../api/statisticsApi';
import {
    Container,
    Typography,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper
} from '@mui/material';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registreerime Chart.js moodulid ja pluginad
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels
);

export default function Statistics({ userId, affiliateId }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const params = {};
        if (userId) params.userId = userId;
        if (affiliateId) params.affiliateId = affiliateId;

        async function fetchData() {
            const data = await getStatistics(params);
            setStats(data);
        }
        fetchData();
    }, [userId, affiliateId]);

    if (!stats) {
        return (
            <Container>
                <Typography>Loading Statistics...</Typography>
            </Container>
        );
    }

    // Destructure serverist tulevad andmed
    const {
        trainingTypeCounts,
        monthlyTrainings,
        yearlyTrainings,
        yearlyScores,
        homeAffiliateName,
        homeAffiliateYearlyTrainings,
    } = stats;

    // Function to get color based on training type
    const getTrainingTypeColor = (type, isHover = false) => {
        const colors = {
            'WOD': { regular: '#1976d2', hover: '#2196f3' },
            'Weightlifting': { regular: '#4caf50', hover: '#66bb6a' },
            'Cardio': { regular: '#ff9800', hover: '#ffc107' },
            'Rowing': { regular: '#9c27b0', hover: '#ba68c8' },
            'Gymnastics': { regular: '#e91e63', hover: '#f06292' },
            'Other': { regular: '#607d8b', hover: '#78909c' }
        };

        if (colors[type]) {
            return isHover ? colors[type].hover : colors[type].regular;
        }

        // Default color for any types not in our list
        return isHover ? '#78909c' : '#607d8b';
    };

    // 1) Ringdiagramm (treeningute jaotus: WOD, Weightlifting, Cardio, Rowing, Gymnastics, Other)
    const doughnutData = {
        labels: Object.keys(trainingTypeCounts),
        datasets: [
            {
                data: Object.values(trainingTypeCounts),
                backgroundColor: Object.keys(trainingTypeCounts).map(type => getTrainingTypeColor(type)),
                hoverBackgroundColor: Object.keys(trainingTypeCounts).map(type => getTrainingTypeColor(type, true)),
            },
        ],
    };
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            datalabels: {
                color: '#ffffff',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value) => {
                    return value; // Kuvab arvud
                }
            }
        },
    };

    // 2) Tabel - treeningud kuude lõikes
    const sortedMonthly = [...monthlyTrainings].sort((a, b) => a.month - b.month);

    // 3) Tulbagraafik - treeningud aastate lõikes
    const barDataTrainings = {
        labels: yearlyTrainings.map((item) => item.year),
        datasets: [
            {
                label: 'Trainings per Year',
                data: yearlyTrainings.map((item) => item.count),
                backgroundColor: '#3f51b5',
                maxBarThickness: 50,
            },
        ],
    };

    // 4) Tulbagraafik - leaderboard sisestuste arv aastate lõikes
    const barDataScores = {
        labels: yearlyScores.map((item) => item.year),
        datasets: [
            {
                label: 'Leaderboard Entries',
                data: yearlyScores.map((item) => item.score),
                backgroundColor: '#e91e63',
                maxBarThickness: 50,
            },
        ],
    };

    // 5) HomeAffiliate treeningute arv (checkIn = true) aastate lõikes
    const barDataHomeAffiliate = {
        labels: homeAffiliateYearlyTrainings?.map(item => item.year) || [],
        datasets: [
            {
                label: `Trainings at ${homeAffiliateName || ''}`,
                data: homeAffiliateYearlyTrainings?.map(item => item.count) || [],
                backgroundColor: '#009688',
                maxBarThickness: 50,
            },
        ],
    };

    // Ühised tulbagraafiku seaded
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            datalabels: {
                display: true,
                color: '#ffffff',
                anchor: 'end',
                align: 'start',
                font: {
                    weight: 'bold',
                    size: 12,
                },
            },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                px: { xs: 2, sm: 4, md: 6 },
            }}
        >
            <Box my={4}>
                <Typography variant="h5" gutterBottom>
                    Statistics
                </Typography>
            </Box>

            {/* RINGDIAGRAMM - Treeningutüübid */}
            <Box
                mb={4}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    height: 400,
                    position: 'relative',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Training Type Distribution
                </Typography>
                <Doughnut data={doughnutData} options={doughnutOptions} />
            </Box>

            {/* TABEL - treeningud kuude lõikes */}
            <Box
                mb={4}
                sx={{ maxWidth: 600, mx: 'auto', pt: 5 }}
            >
                <Typography variant="h6" gutterBottom>
                    Trainings by Month
                </Typography>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Month</TableCell>
                                <TableCell>Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedMonthly.map((item) => (
                                <TableRow key={item.month}>
                                    <TableCell>{item.month}</TableCell>
                                    <TableCell>{item.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            {/* TULBAD - treeningud aastate lõikes */}
            <Box
                mb={4}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    height: 400,
                    position: 'relative',
                    pt: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Trainings by Year
                </Typography>
                <Bar data={barDataTrainings} options={barOptions} />
            </Box>

            {/* TULBAD - leaderboard sisestuste arv aastate lõikes */}
            <Box
                mb={4}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    height: 400,
                    position: 'relative',
                    pt: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Leaderboard Entries by Year
                </Typography>
                <Bar data={barDataScores} options={barOptions} />
            </Box>

            {/* HOME AFFILIATE TULBAD - kui kasutajal on homeAffiliate */}
            {homeAffiliateName && homeAffiliateYearlyTrainings?.length > 0 && (
                <Box
                    mb={4}
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        height: 400,
                        position: 'relative',
                        pt: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Total trainings at {homeAffiliateName}
                    </Typography>
                    <Bar data={barDataHomeAffiliate} options={barOptions} />
                </Box>
            )}
        </Container>
    );
}