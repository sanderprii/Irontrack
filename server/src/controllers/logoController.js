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

        // Kontrolli algse faili suurust - vajadusel saab logida
        console.log(`Original file size: ${req.file.size} bytes`);

        // Vähenda faili kvaliteeti ja suurust, et see oleks alla 0.5MB (512KB)
        const MAX_SIZE_BYTES = 512 * 1024; // 0.5MB
        let quality = 80; // Alusta 80% kvaliteediga
        let outputBuffer = null;
        let currentSize = req.file.size;

        // Resize alati kindla suuruseni
        const resizedImage = sharp(req.file.buffer)
            .resize({
                width: 300,
                height: 300,
                fit: 'cover',
                position: 'center'
            });

        // Proovi erinevaid kvaliteedi seadeid, kuni pilt on piisavalt väike
        while (quality >= 10 && (outputBuffer === null || currentSize > MAX_SIZE_BYTES)) {
            if (req.file.mimetype.includes('png')) {
                outputBuffer = await resizedImage.png({ quality }).toBuffer();
            } else {
                outputBuffer = await resizedImage.jpeg({ quality }).toBuffer();
            }

            currentSize = outputBuffer.length;

            if (currentSize > MAX_SIZE_BYTES) {
                quality -= 10; // Vähenda kvaliteeti
            }
        }

        // Kui ikka liiga suur, vähenda veel füüsilist suurust
        if (currentSize > MAX_SIZE_BYTES) {
            outputBuffer = await sharp(outputBuffer)
                .resize({ width: 150, height: 150, fit: 'cover' })
                .jpeg({ quality: 60 })
                .toBuffer();

            currentSize = outputBuffer.length;
        }

        console.log(`Processed file size: ${currentSize} bytes, quality: ${quality}%`);

        // Kontrolli, kas töödeldud pilt on ikka liiga suur
        if (currentSize > MAX_SIZE_BYTES) {
            return res.status(400).json({
                error: 'Unable to reduce file size sufficiently. Please use a smaller image.'
            });
        }

        // Konverteeri pilt Base64 formaati
        const base64Image = outputBuffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        // Uuenda kasutaja profiilipilti andmebaasis
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(req.body.userId) },
            data: { logo: dataUrl },
            select : {
                id: true,
                email: true,
                fullName: true,
                dateOfBirth: true,
                affiliateOwner: true,
                isAcceptedTerms: true,
                phone: true,
                address: true,
                logo: true,
                emergencyContact: true,
                homeAffiliate: true,
            }

        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ error: 'Error uploading profile picture: ' + error.message });
    }
};

module.exports = { uploadLogo, uploadProfilePicture };
