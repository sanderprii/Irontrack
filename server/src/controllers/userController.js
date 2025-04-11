const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
// kui sul on password validation:
const { validatePassword } = require('../utils/passwordValidation');
// jms

exports.getUserData = async (req, res) => {
    // varem: const userId = parseInt(req.query.userId);
    // aga tavaliselt me tahame JWT-s olevat userId, mitte query parametrit
    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data.' });
    }
};

// Visit history
exports.getVisitHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const visits = await prisma.classAttendee.findMany({
            where: { userId },
            include: { classSchedule: true },
            orderBy: { classId: 'desc' }
        });
        res.json(visits);
    } catch (error) {
        console.error('Error fetching user visit history:', error);
        res.status(500).json({ error: 'Failed to fetch user visit history.' });
    }
};

// Purchase history
exports.getPurchaseHistory = async (req, res) => {
    const userId = req.query.userId;
    const affiliateId = req.query.affiliateId;
    try {

        if(!isNaN(affiliateId)) {
            const purchases = await prisma.userPlan.findMany({
                where: { userId: parseInt(userId), affiliateId: parseInt(affiliateId) },
                orderBy: { id: 'desc' }
            });
            res.json(purchases);
        } else {

            const plans = await prisma.userPlan.findMany({
                where: {userId: parseInt(userId)},
                orderBy: {id: 'desc'}
            });
            res.json(plans);
        }
    } catch (error) {
        console.error('Error fetching user plans:', error);
        res.status(500).json({ error: 'Failed to fetch user plans.' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check old password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid current password.' });
        }



        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Password changed successfully!' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'An error occurred while changing password.' });
    }
};

// Edit profile
exports.editProfile = async (req, res) => {
    const userId = req.user.id;
    const { fullName, phone, address, dateOfBirth, email } = req.body;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                fullName: fullName || null,

                email: email || null,
                phone: phone || null,
                address: address || null,
            },
        });

        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'An error occurred while updating your profile.' });
    }
};

// getUser for general profile
exports.getUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                credit: true,
                fullName: true,
                email: true,
                phone: true,
                credit: true,
                homeAffiliate: true,
                monthlyGoal: true,
                logo: true,
                address: true,
                emergencyContact: true,
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

// Update user data (PUT /api/user)
exports.updateUserData = async (req, res) => {
    const userId = req.user.id;
    const { fullName, email, dateOfBirth } = req.body;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                fullName,
                email,

            },
        });
        res.json({ message: 'User data updated successfully.' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Failed to update user data.' });
    }
};

// get user-plans by affiliateId
exports.getUserPlansByAffiliate = async (req, res) => {
    const userId = req.user.id;
    const { affiliateId } = req.query;

    if (!affiliateId) {
        return res.status(400).json({ error: 'affiliateId is required.' });
    }

    try {
        const userPlans = await prisma.userPlan.findMany({
            where: {
                affiliateId: parseInt(affiliateId, 10),
                userId,
            },
            select: {
                id: true,
                planId: true,
                trainingType: true,
                planName: true,
                validityDays: true,
                price: true,
                purchasedAt: true,
                endDate: true,
                sessionsLeft: true,
                contractId: true,
                paymentHoliday: true,
            },
        });
        res.json(userPlans);
    } catch (error) {
        console.error('Error fetching user plans by affiliate:', error);
        res.status(500).json({ error: 'Server error fetching user plans.' });
    }
};

exports.addUserNote = async (req, res) => {
    try {
        const { userId } = req.params;
        const { note, flag } = req.body;

        if (!note || !flag) {
            return res.status(400).json({ error: "note and flag are required" });
        }

        // Eeldame, et flag võib olla "red", "yellow", "green"
        if (!["red", "yellow", "green"].includes(flag)) {
            return res.status(400).json({ error: "Invalid flag value." });
        }

        const newNote = await prisma.userNote.create({
            data: {
                userId: parseInt(userId, 10),
                note,
                flag,
            },
        });

        res.json(newNote);
    } catch (error) {
        console.error("❌ Error adding user note:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteUserNote = async (req, res) => {
    try {
        const { userId, noteId } = req.params;
        const deletedNote = await prisma.userNote.delete({
            where: { id: parseInt(noteId, 10) },
        });
        res.json(deletedNote);
    } catch (error) {
        console.error("❌ Error deleting user note:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getUserAttendees = async (req, res) => {
    try {
        const { userId, affiliateId } = req.query;

        // Eeldame, et userId on vajalik (kui see puudub, võiks ka veateate visata)
        if (!userId) {
            return res.status(400).json({ error: 'userId is required.' });
        }

        // Alustame "filters" objektiga
        const filters = {
            userId: parseInt(userId, 10),
            checkIn: true
        };

        // Kui affiliateId on olemas ja EI OLE string 'undefined', siis parsimine
        // NB! typeof affiliateId === 'string' => saame parseInt teha
        if (affiliateId !== undefined && affiliateId !== 'undefined') {
            const numericAffiliateId = parseInt(affiliateId, 10);
            // lisa, kui see on arv
            if (!isNaN(numericAffiliateId)) {
                filters.affiliateId = numericAffiliateId;
            }
        }

        // Nüüd teeme päringu, lisades filters
        const userAttendees = await prisma.classAttendee.findMany({
            where: filters,
            select: {
                id: true,
                classId: true,
                userId: true,
                classSchedule: {
                    select: {
                        id: true,
                        trainingName: true,
                        time: true,
                        trainingType: true,
                        wodName: true,
                        wodType: true,
                        description: true,
                        trainer: true,
                    },
                },
            },
        });

        // Leaderboard entry'd
        const userClassLeaderboard = await prisma.classLeaderboard.findMany({
            where: {
                classId: { in: userAttendees.map((a) => a.classId) },
                userId: parseInt(userId, 10),
            },
        });

        // Liidame leaderboard info
        const combinedData = userAttendees.map((attendee) => {
            const lbEntries = userClassLeaderboard.filter(
                (lb) => lb.classId === attendee.classId
            );
            return {
                ...attendee,
                leaderboard: lbEntries,
            };
        });

        res.json(combinedData);

    } catch (error) {
        console.error('Error fetching user attendees:', error);
        res.status(500).json({ error: 'Server error fetching user attendees.' });
    }
};

// Get all family members for the current user
exports.getFamilyMembers = async (req, res) => {
    const userId = req.user.id;

    try {
        const familyMembers = await prisma.familyMember.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(familyMembers);
    } catch (error) {
        console.error('Error fetching family members:', error);
        res.status(500).json({ error: 'Failed to fetch family members.' });
    }
};

// Add a new family member
exports.addFamilyMember = async (req, res) => {
    const userId = req.user.id;
    const { fullName } = req.body;

    if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Full name is required.' });
    }

    try {
        const newFamilyMember = await prisma.familyMember.create({
            data: {
                userId,
                fullName: fullName.trim()
            }
        });

        res.status(201).json(newFamilyMember);
    } catch (error) {
        console.error('Error adding family member:', error);
        res.status(500).json({ error: 'Failed to add family member.' });
    }
};

// Delete a family member
exports.deleteFamilyMember = async (req, res) => {
    const userId = req.user.id;
    const familyMemberId = parseInt(req.params.id);

    if (isNaN(familyMemberId)) {
        return res.status(400).json({ error: 'Invalid family member ID.' });
    }

    try {
        // Ensure the family member belongs to the current user
        const familyMember = await prisma.familyMember.findFirst({
            where: {
                id: familyMemberId,
                userId
            }
        });

        if (!familyMember) {
            return res.status(404).json({ error: 'Family member not found or does not belong to this user.' });
        }

        await prisma.familyMember.delete({
            where: { id: familyMemberId }
        });

        res.json({ message: 'Family member deleted successfully.' });
    } catch (error) {
        console.error('Error deleting family member:', error);
        res.status(500).json({ error: 'Failed to delete family member.' });
    }
};