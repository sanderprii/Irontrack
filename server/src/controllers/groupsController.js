// controllers/groupsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /messagegroups
 * Tagastab kõik grupid grupeeritult groupName järgi,
 * koos memberite fullName'idega.
 */
const getGroups = async (req, res) => {
    try {

        const affiliateId = parseInt(req.query.affiliateId);

        // 1. Leia kõik read MessageGroup tabelist
        const rows = await prisma.messageGroup.findMany({
            where: { affiliateId },


        });

        // 2. Leia kõik read UserMessageGroup tabelist
        const memberRows = await prisma.userMessageGroup.findMany({
            where: {
                groupId: { in: rows.map((row) => row.id) },
            },
            include: {
                user: true,
            },
        });

        // 3. Gruppi liikmed
        const groupMembers = {};
        memberRows.forEach((row) => {
            const groupId = row.groupId;
            if (!groupMembers[groupId]) {
                groupMembers[groupId] = [];
            }
            groupMembers[groupId].push(row.user);
        });

        // 4. Liida liikmed gruppidega
        rows.forEach((row) => {
            row.members = groupMembers[row.id] || [];
        });




        res.json(rows);
    } catch (error) {
        console.error('Error in getGroups:', error);
        res.status(500).json({ error: 'Failed to get groups' });
    }
};

/**
 * POST /messagegroups
 * Body:
 * {
 *   "groupName": "New Group",
 *   "members": [{ "id": 12 }, { "id": 13 }]
 * }
 */
const createGroup = async (req, res) => {
    try {
        const user = req.user;
        const affiliateId = parseInt(req.query.affiliateId);
        const { groupName, members } = req.body;

        if (!groupName) {
            return res.status(400).json({ error: 'groupName is required' });
        }

        // Loome uued read
        const created = await prisma.messageGroup.create(
            {
                data: {

                    groupName,
                    affiliateId,
                },
            }
        )

        if (members && members.length > 0) {
            await prisma.userMessageGroup.createMany({
                data: members.map((member) => ({
                    userId: member.id,
                    groupId: created.id,
                })),
            });

            }


        res.json({ message: 'Group created' });
    } catch (error) {
        console.error('Error in createGroup:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
};

/**
 * PUT /messagegroups/:id
 * Body:
 * {
 *   "groupName": "Some Group",
 *   "members": [{ "id": 12 }, { "id": 13 }]
 * }
 * NB! :id on ANY row's ID, mis kuulub antud groupName'ile.
 */
const updateGroup = async (req, res) => {
    try {
        const affiliateId = parseInt(req.query.affiliateId);
        const { groupName, members } = req.body;
const groupId = parseInt(req.params.id);
        if (!groupName) {
            return res.status(400).json({ error: 'groupName is required' });
        }

        // 1. Uuenda MessageGroup
        const updated = await prisma.messageGroup.update({
            where: { id: groupId },
            data: { groupName },
        });

        // 2. Leia kõik UserMessageGroup read, mis kuuluvad sellele grupile
        const currentMembers = await prisma.userMessageGroup.findMany({
            where: { groupId },
        });

        // 3. Leia need read, mis on uues members listis, aga puuduvad currentMembers listist
        const toAdd = members.filter((member) => {
            return !currentMembers.some((current) => current.userId === member.id);
        });

        // 4. Leia need read, mis on currentMembers listis, aga puuduvad uues members listis
        const toRemove = currentMembers.filter((current) => {
            return !members.some((member) => member.id === current.userId);
        });

        // 5. Lisa puuduvad read

        if (toAdd.length > 0) {
            await prisma.userMessageGroup.createMany({
                data: toAdd.map((member) => ({
                    userId: member.id,
                    groupId,
                })),
            });
        }

        // 6. Kustuta mittevajalikud read
        if (toRemove.length > 0) {
            await prisma.userMessageGroup.deleteMany({
                where: {
                    groupId,
                    userId: { in: toRemove.map((row) => row.userId) },
                },
            });
        }





        res.json({
            message: 'Group updated successfully',

        });
    } catch (error) {
        console.error('Error in updateGroup:', error);
        res.status(500).json({ error: 'Failed to update group' });
    }
};


/**
 * GET /messagegroups/search?query=John
 * Tagastab User.id ja User.fullName listi
 */
const searchUsersInGroups = async (req, res) => {
    try {
        const user = req.user;
        const affiliateId = user.affiliateId;
        const query = req.query.query || '';

        // Otsime ainult need kasutajad, kes (või kas peavad) kuuluma samasse affiliate'i?
        // Sinu use-case otsustab. Näiteks:
        const users = await prisma.user.findMany({
            where: {
                affiliateOwner: false, // eeldame, et ei otsi ownerit? vali vastavalt
                fullName: {
                    contains: query,
                    mode: 'insensitive',
                },
                // Kas me peame also checkima, et see user kuulub samasse affiliate'i?
                // Sinu loogika: kui members tabel on 'Members', teed sealt checki?
            },
            select: {
                id: true,
                fullName: true,
            },
            take: 20, // max 20 tulemust
        });

        res.json(users);
    } catch (error) {
        console.error('Error in searchUsersInGroups:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
};

module.exports = {
    getGroups,
    createGroup,
    updateGroup,
    searchUsersInGroups,
};
