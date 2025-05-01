// controllers/logoController.js
const sharp = require('sharp');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Kontrolli faili suurust – maksimaalselt 1MB (1MB = 1048576 baiti)
        if (req.file.size > 1048576) {
            return res.status(400).json({ error: 'File size exceeds 1MB limit' });
        }

        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;

        // Vähenda pilti proportsionaalselt (kasutades "inside" fit'i ja withoutEnlargement valikut)
        const resizedBuffer = await sharp(req.file.buffer)
            .resize({
                width: MAX_WIDTH,
                height: MAX_HEIGHT,
                fit: 'contain',
                withoutEnlargement: true,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .toBuffer();

        // Muuda vähendatud pilt base64 stringiks
        const base64Image = resizedBuffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        // Saada affiliateId request body-st
        const affiliateId = req.body.affiliateId;
        if (!affiliateId) {
            return res.status(400).json({ error: 'Affiliate ID not provided' });
        }

        // Uuenda affiliate logo andmebaasis Prisma abil
        const updatedAffiliate = await prisma.affiliate.update({
            where: { id: parseInt(affiliateId) },
            data: { logo: dataUrl },
        });

        return res
            .status(200)
            .json({ message: 'Logo uploaded successfully', affiliate: updatedAffiliate });
    } catch (error) {
        console.error('Error uploading logo:', error);
        return res.status(500).json({ error: 'Error uploading logo' });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Logi faili info debugging'uks
        console.log(`File info: size=${req.file.size}, type=${req.file.mimetype}`);

        // Failisuuruse kontroll - pole vajalik, kuna multer juba kontrollib
        // aga võib logimiseks alles jätta
        if (req.file.size > 15 * 1024 * 1024) {
            return res.status(400).json({ error: 'File too large, maximum is 15MB' });
        }

        // Pildi töötlemine sharp teegiga, vähendame pildi suurust tugevalt
        // ja tagame, et väljundfail on alati alla 0.5MB
        const MAX_OUTPUT_SIZE = 512 * 1024; // 0.5MB

        try {
            // Muudame alati pildi JPEG formaati, et kindlustada ühilduvus
            const processedImage = sharp(req.file.buffer);
            const metadata = await processedImage.metadata();

            // Määrame kindla maksimaalse suuruse
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;

            // Vähendame pildi suurust
            let outputBuffer = await processedImage
                .resize({
                    width: MAX_WIDTH,
                    height: MAX_HEIGHT,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 }) // Konverteerime JPEG formaati
                .toBuffer();

            // Kontrollime, kas saavutasime soovitud faili suuruse
            if (outputBuffer.length > MAX_OUTPUT_SIZE) {
                // Kui ikka liiga suur, vähendame kvaliteeti
                let quality = 70;
                while (outputBuffer.length > MAX_OUTPUT_SIZE && quality > 30) {
                    outputBuffer = await sharp(req.file.buffer)
                        .resize({
                            width: MAX_WIDTH,
                            height: MAX_HEIGHT,
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .jpeg({ quality })
                        .toBuffer();

                    quality -= 10;
                }

                // Kui ikka liiga suur, vähendame füüsilist suurust
                if (outputBuffer.length > MAX_OUTPUT_SIZE) {
                    outputBuffer = await sharp(req.file.buffer)
                        .resize({
                            width: MAX_WIDTH / 2,
                            height: MAX_HEIGHT / 2,
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .jpeg({ quality: 60 })
                        .toBuffer();
                }
            }

            // Logi lõpptulemus
            console.log(`Processed file size: ${outputBuffer.length} bytes`);

            // Konverteeri pilt Base64 formaati
            const base64Image = outputBuffer.toString('base64');
            const dataUrl = `data:image/jpeg;base64,${base64Image}`;

            // Uuenda kasutaja profiilipilti andmebaasis, aga ära tagasta parooli
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(req.body.userId) },
                data: { logo: dataUrl },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    address: true,
                    dateOfBirth: true,
                    emergencyContact: true,
                    logo: true,
                    isAcceptedTerms: true,
                    // Parool on välja jäetud
                }
            });

            return res.status(200).json(updatedUser);
        } catch (imageError) {
            console.error('Error processing image:', imageError);
            return res.status(500).json({ error: 'Error processing image: ' + imageError.message });
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ error: 'Error uploading profile picture: ' + error.message });
    }
};

module.exports = { uploadLogo, uploadProfilePicture };
