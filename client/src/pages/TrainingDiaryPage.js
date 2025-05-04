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
                } else {
                    navigate("/register-training");
                }
            } catch (error) {
                console.error("❌ Error fetching user home gym:", error);
            }
        };

        getUserHomeGym();
    }, []);

    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>

        </Container>
    );
};

export default TrainingDiaryPage;
