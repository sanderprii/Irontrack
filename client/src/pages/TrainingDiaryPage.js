import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';



import { checkHomeAffiliate, fetchAffiliateInfo } from "../api/getClassesApi";


const TrainingDiaryPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const getUserHomeGym = async () => {
            try {
                const userHomeAffiliate = await checkHomeAffiliate();
                if (userHomeAffiliate) {

                    const affiliateData = await fetchAffiliateInfo(userHomeAffiliate);

                    navigate("/classes", { state: { affiliate: affiliateData.affiliate } });
                }
            } catch (error) {
                console.error("❌ Error fetching user home gym:", error);
            }
        };

        getUserHomeGym();
    }, []);

    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Training Diary
            </Typography>
            <Typography variant="body1">
                Here you can log your workouts, track progress, and view training history.
            </Typography>
            {/* Add your training diary functionality here */}
        </Container>
    );
};

export default TrainingDiaryPage;
