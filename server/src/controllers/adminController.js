// Täielik administratiivne kontroller, mis toetab mõlemat URL stiili
// Lisa see failina server/src/controllers/adminController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lisame debug režiimi
const DEBUG = true;

// Abifunktsioonid tabelinimede käsitlemiseks
function normalizeTableName(tableName) {
    if (!tableName) return null;

    // Kõik potentsiaalsed variatsioonid
    const variations = [
        tableName,                                              // originaal (nt "user")
        tableName.toLowerCase(),                                // kõik väiketähed (nt "user")
        tableName.toUpperCase(),                                // kõik suurtähed (nt "USER")
        tableName.charAt(0).toUpperCase() + tableName.slice(1), // PascalCase (nt "User")
        tableName.charAt(0).toLowerCase() + tableName.slice(1)  // camelCase (nt "user")
    ];

    // Kontrolli, milline variant on Prisma kliendis olemas
    for (const variant of variations) {
        if (prisma[variant] && typeof prisma[variant] === 'object') {
            if (DEBUG) console.log(`Leitud Prisma mudel: ${variant} (originaal: ${tableName})`);
            return variant;
        }
    }

    // Kui otsest vastet ei leitud, tagasta originaal
    if (DEBUG) console.log(`Prisma mudelit ei leitud. Kasutan originaali: ${tableName}`);
    return tableName;
}

/**
 * Tagastab kõik andmebaasi tabelid
 */
exports.getTables = async (req, res) => {
    try {
        if (DEBUG) console.log('Päritakse andmebaasi tabeleid');

        // Kõige esimene valik - kasuta Prisma sisseehitatud meetodeid
        const dataModels = Object.keys(prisma).filter(key =>
            !key.startsWith('_') &&
            typeof prisma[key] === 'object' &&
            prisma[key] !== null &&
            typeof prisma[key].findMany === 'function'
        );

        if (dataModels.length > 0) {
            if (DEBUG) console.log('Tagastan Prisma mudelid:', dataModels);
            return res.json(dataModels);
        }

        // Teine valik - SQL päring
        try {
            const result = await prisma.$queryRaw`
              SELECT table_name 
              FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_type = 'BASE TABLE'
              ORDER BY table_name;
            `;
            const tableNames = result.map(row => row.table_name);

            if (DEBUG) console.log('Tagastan SQL päringuga leitud tabelid:', tableNames);
            return res.json(tableNames);
        } catch (sqlError) {
            console.error('SQL päring tabelite jaoks ebaõnnestus:', sqlError);
        }

        // Kui kumbki meetod ei töötanud, tagastame staatilise nimekirja
        const staticTables = Object.keys(prisma).filter(k => !k.startsWith('_') && typeof prisma[k] === 'object');

        if (DEBUG) console.log('Tagastan staatilise tabelite nimekirja:', staticTables);
        return res.json(staticTables);
    } catch (error) {
        console.error('Viga tabelite pärimisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

/**
 * Tagastab konkreetse tabeli andmed
 */
exports.getTableData = async (req, res) => {
    try {
        const { tableName: rawTableName } = req.params;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 100;
        const offset = page * limit;

        // Normaliseerime tabelinime
        const tableName = normalizeTableName(rawTableName);

        if (DEBUG) console.log(`Päritakse tabeli ${tableName} andmeid, lehekülg ${page}, limiit ${limit}`);

        // Proovime kasutada Prisma API-d
        if (prisma[tableName] && typeof prisma[tableName].findMany === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d tabeli ${tableName} pärimiseks`);

                // Loeme andmed
                const data = await prisma[tableName].findMany({
                    skip: offset,
                    take: limit
                });

                // Loeme metaandmed
                const totalRows = await prisma[tableName].count();

                // Saame veergude nimed esimesest andmeobjektist või tühjast objektist
                let columns = [];
                if (data.length > 0) {
                    columns = Object.keys(data[0]);
                } else {
                    // Proovime saada veergude nimed mudeli struktuurist
                    const emptyObject = {};
                    for (const key in prisma[tableName].fields) {
                        if (!key.startsWith('_')) {
                            emptyObject[key] = null;
                        }
                    }
                    columns = Object.keys(emptyObject);
                }

                // Määrame nõutud väljad
                // Praegu lihtsalt id, mida saaks täiendada
                const requiredFields = ['id'];

                if (DEBUG) console.log(`Tagastan ${data.length} rida andmeid Prisma API kaudu`);
                return res.json({
                    columns,
                    data,
                    totalRows,
                    requiredFields
                });
            } catch (prismaError) {
                console.error(`Prisma API viga tabeli ${tableName} pärimisel:`, prismaError);
                // Jätkame SQL meetodiga
            }
        }

        // Kui Prisma API ei töötanud, kasutame SQL päringut
        try {
            if (DEBUG) console.log(`Kasutan SQL päringut tabeli ${tableName} andmete saamiseks`);

            // Kontrollime, kas tabel eksisteerib
            const tableExists = await checkTableExists(tableName);
            if (!tableExists) {
                return res.status(404).json({ error: `Tabelit ${tableName} ei leitud` });
            }

            // Tabeli struktuuri päring
            const columnsInfo = await getTableColumns(tableName);
            const columns = columnsInfo.map(col => col.name);

            // Nõutud väljad
            const requiredFields = columnsInfo
                .filter(col => !col.isNullable && !col.hasDefaultValue && !col.isAutoincrement)
                .map(col => col.name);

            // Andmepäring
            const query = `
                SELECT * FROM "${tableName}"
                LIMIT ${limit} OFFSET ${offset}
            `;

            const data = await prisma.$queryRawUnsafe(query);

            // Ridade koguarv
            const countQuery = `SELECT COUNT(*) as count FROM "${tableName}"`;
            const countResult = await prisma.$queryRawUnsafe(countQuery);
            const totalRows = parseInt(countResult[0].count);

            if (DEBUG) console.log(`Tagastan ${data.length} rida andmeid SQL kaudu`);
            return res.json({
                columns,
                data,
                totalRows,
                requiredFields
            });
        } catch (sqlError) {
            console.error(`SQL viga tabeli ${tableName} pärimisel:`, sqlError);
            return res.status(500).json({
                error: 'SQL viga tabeli pärimisel',
                details: sqlError.message,
                tableName: tableName
            });
        }
    } catch (error) {
        console.error('Viga tabeli andmete pärimisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

/**
 * Tagastab tabeli primaarvõtme nime
 */
exports.getTablePrimaryKey = async (req, res) => {
    try {
        const { tableName: rawTableName } = req.params;
        const tableName = normalizeTableName(rawTableName);

        if (DEBUG) console.log(`Päritakse tabeli ${tableName} primaarvõtit`);

        // Enamikul juhtudel on primaarvõti "id"
        return res.json({ primaryKey: "id" });

    } catch (error) {
        console.error('Viga primaarvõtme pärimisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

/**
 * Uuendab tabeli rida - TÄHELEPANU: Toetame nii /tableName/:id kui ka /tableName marsruute
 */
exports.updateRow = async (req, res) => {
    try {
        const { tableName: rawTableName } = req.params;
        const tableName = normalizeTableName(rawTableName);

        // ID võib tulla kas URL-ist või päringust
        const id = req.params.id || req.body.id;
        const rowData = req.body;

        if (DEBUG) {
            console.log(`Uuendame rida tabelis ${tableName}, ID: ${id}`);
            console.log('Päringu params:', req.params);
            console.log('Päringu body:', req.body);
        }

        // Kontrollime ID olemasolu
        if (!id) {
            return res.status(400).json({ error: 'Primaarvõti puudub. Ei saa rida uuendada.' });
        }

        // Ettevalmistame andmed
        const updateData = { ...rowData };

        // Eemaldame id välja, et vältida konflikte
        if (updateData.id !== undefined) {
            delete updateData.id;
        }

        // Teisendame teadaolevad tüübid
        convertKnownTypes(updateData);

        // Asendame tühjad väärtused null-iga
        replaceEmptyStrings(updateData);

        if (DEBUG) {
            console.log('Puhastatud andmed uuendamiseks:', updateData);
        }

        // Kasutame Prisma API-d
        if (prisma[tableName] && typeof prisma[tableName].update === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d rea uuendamiseks tabelis ${tableName}`);

                // Määrame ID väärtuse numbriliseks, kui see on number
                const idValue = !isNaN(id) ? parseInt(id) : id;

                // Proovime uuendada rida
                const updatedRow = await prisma[tableName].update({
                    where: { id: idValue },
                    data: updateData
                });

                if (DEBUG) console.log('Uuendamine õnnestus Prisma API-ga:', updatedRow);
                return res.json(updatedRow);
            } catch (prismaError) {
                console.error('Prisma API viga:', prismaError);
                return res.status(500).json({
                    error: 'Rea uuendamine ebaõnnestus',
                    details: prismaError.message,
                    tableName: tableName,
                    id: id
                });
            }
        } else {
            return res.status(404).json({
                error: 'Tabelit ei leitud või puudub uuendamise funktsioon',
                tableName: tableName
            });
        }
    } catch (error) {
        console.error('Viga rea uuendamisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

/**
 * Lisab tabelisse uue rea
 */
exports.addRow = async (req, res) => {
    try {
        const { tableName: rawTableName } = req.params;
        const tableName = normalizeTableName(rawTableName);
        const rowData = req.body;

        if (DEBUG) {
            console.log(`Lisame rea tabelisse ${tableName}`);
            console.log('Andmed:', rowData);
        }

        // Ettevalmistame andmed
        const insertData = { ...rowData };

        // Eemaldame id, kui see on tühi või 0
        if (insertData.id === '' || insertData.id === 0 || insertData.id === '0') {
            delete insertData.id;
        }

        // Teisendame teadaolevad tüübid
        convertKnownTypes(insertData);

        // Asendame tühjad väärtused null-iga
        replaceEmptyStrings(insertData);

        // Eemaldame createdAt, kui see on null, et kasutada vaikeväärtust
        if (insertData.createdAt === null) {
            delete insertData.createdAt;
        }

        if (DEBUG) {
            console.log('Puhastatud andmed lisamiseks:', insertData);
        }

        // Kasutame Prisma API-d
        if (prisma[tableName] && typeof prisma[tableName].create === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d rea lisamiseks tabelisse ${tableName}`);

                // 1. Identifitseerime relatsioonid ja ID väljad
                const { cleanData, relations } = prepareRelations(insertData);

                if (DEBUG) {
                    console.log('Töödeldud andmed:', cleanData);
                    console.log('Relatsioonid:', relations);
                }

                // 2. Ühendame tavalised andmed ja relatsioonid
                const finalData = {
                    ...cleanData,
                    ...relations
                };

                // 3. Loome uue rea
                const newRow = await prisma[tableName].create({
                    data: finalData
                });

                if (DEBUG) console.log('Rea lisamine õnnestus:', newRow);
                return res.status(201).json(newRow);
            } catch (prismaError) {
                console.error('Prisma API viga:', prismaError);

                // Proovime lihtsustatud andmetega
                try {
                    if (DEBUG) console.log('Proovime lihtsustatud andmetega');

                    // Eemaldame relatsioonid ja proovime ainult põhiandmeid
                    const simpleData = { ...insertData };

                    // Eemaldame kõik väljad, mis lõppevad 'Id' aga pole 'id'
                    for (const key in simpleData) {
                        if (key !== 'id' && key.endsWith('Id')) {
                            // Jätame alles ainult id numbrid
                            if (simpleData[key] !== null && simpleData[key] !== undefined) {
                                simpleData[key] = parseInt(simpleData[key]) || simpleData[key];
                            }
                        }
                    }

                    // Eemaldame id välja, et lasta andmebaasil see genereerida
                    if ('id' in simpleData) {
                        delete simpleData.id;
                    }

                    if (DEBUG) console.log('Lihtsustatud andmed:', simpleData);

                    const newRow = await prisma[tableName].create({
                        data: simpleData
                    });

                    if (DEBUG) console.log('Rea lisamine õnnestus lihtsustatud andmetega:', newRow);
                    return res.status(201).json(newRow);
                } catch (simplePrismaError) {
                    console.error('Lihtsustatud andmetega lisamine ebaõnnestus:', simplePrismaError);
                    return res.status(500).json({
                        error: 'Rea lisamine ebaõnnestus',
                        details: simplePrismaError.message,
                        originalError: prismaError.message,
                        tableName: tableName
                    });
                }
            }
        } else {
            return res.status(404).json({
                error: 'Tabelit ei leitud või puudub lisamise funktsioon',
                tableName: tableName
            });
        }
    } catch (error) {
        console.error('Viga rea lisamisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

/**
 * Kustutab tabelist rea
 */
exports.deleteRow = async (req, res) => {
    try {
        const { tableName: rawTableName, id } = req.params;
        const tableName = normalizeTableName(rawTableName);

        if (DEBUG) console.log(`Kustutame rea tabelist ${tableName}, ID: ${id}`);

        // Kontrollime ID olemasolu
        if (!id) {
            return res.status(400).json({ error: 'Puudub rea ID' });
        }

        // Määrame ID väärtuse numbriliseks, kui see on number
        const idValue = !isNaN(id) ? parseInt(id) : id;

        // Kasutame Prisma API-d
        if (prisma[tableName] && typeof prisma[tableName].delete === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d rea kustutamiseks tabelist ${tableName}`);

                const deletedRow = await prisma[tableName].delete({
                    where: { id: idValue }
                });

                if (DEBUG) console.log('Rea kustutamine õnnestus:', deletedRow);
                return res.json({ message: 'Rida edukalt kustutatud', deletedRow });
            } catch (prismaError) {
                console.error('Prisma API viga:', prismaError);
                return res.status(500).json({
                    error: 'Rea kustutamine ebaõnnestus',
                    details: prismaError.message,
                    tableName: tableName,
                    id: id
                });
            }
        } else {
            return res.status(404).json({
                error: 'Tabelit ei leitud või puudub kustutamise funktsioon',
                tableName: tableName
            });
        }
    } catch (error) {
        console.error('Viga rea kustutamisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

// =================== ABIFUNKTSIOONID ===================

/**
 * Kontrollib tabeli olemasolu
 */
async function checkTableExists(tableName) {
    try {
        const result = await prisma.$queryRaw`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = ${tableName}
            ) as exists;
        `;
        return result[0].exists;
    } catch (error) {
        console.error(`Viga tabeli ${tableName} olemasolu kontrollimisel:`, error);
        return false;
    }
}

/**
 * Tagastab tabeli veergude info
 */
async function getTableColumns(tableName) {
    try {
        const result = await prisma.$queryRaw`
            SELECT
                column_name as "name",
                data_type as "type",
                is_nullable = 'NO' as "isNullable",
                column_default IS NOT NULL as "hasDefaultValue",
                pg_get_serial_sequence(quote_ident(${tableName}), column_name) IS NOT NULL as "isAutoincrement",
                EXISTS (
                    SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                    AND tc.table_name = ${tableName}
                    AND kcu.column_name = columns.column_name
                ) as "isPrimary"
            FROM information_schema.columns
            WHERE table_name = ${tableName}
            ORDER BY ordinal_position;
        `;
        return result;
    } catch (error) {
        console.error(`Viga tabeli ${tableName} veergude pärimisel:`, error);
        return [];
    }
}

/**
 * Teisendab teadaolevad väljad õigeteks tüüpideks
 */
function convertKnownTypes(data) {
    // Väljad, mis peaksid olema täisarvud
    const integerFields = [
        'id', 'affiliateId', 'trainerId', 'userId', 'planId', 'contractId',
        'recipientId', 'classId', 'trainingId', 'groupId', 'memberId', 'creditId',
        'homeAffiliate', 'ownerId', 'seriesId', 'paymentDay', 'familyMemberId'
    ];

    // Väljad, mis peaksid olema ujukomaarvud
    const floatFields = [
        'price', 'amount', 'paymentAmount', 'firstPaymentAmount', 'credit', 'weight'
    ];

    // Väljad, mis peaksid olema tõeväärtused
    const booleanFields = [
        'isActive', 'isAcceptedTerms', 'affiliateOwner', 'active', 'emailConfirmed',
        'repeatWeekly', 'canRegister', 'freeClass', 'checkIn', 'atRisk', 'isFirstPayment',
        'paymentHoliday', 'decrease', 'isCredit', 'isFamilyMember'
    ];

    // Teisendame täisarvud
    for (const field of integerFields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
            const parsedValue = parseInt(data[field], 10);
            data[field] = isNaN(parsedValue) ? data[field] : parsedValue;
        }
    }

    // Teisendame ujukomaarvud
    for (const field of floatFields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
            const parsedValue = parseFloat(data[field]);
            data[field] = isNaN(parsedValue) ? data[field] : parsedValue;
        }
    }

    // Teisendame tõeväärtused
    for (const field of booleanFields) {
        if (data[field] !== undefined && data[field] !== null) {
            if (typeof data[field] === 'string') {
                const lowerValue = data[field].toLowerCase();
                if (lowerValue === 'true' || lowerValue === 't' || lowerValue === '1' || lowerValue === 'yes' || lowerValue === 'y') {
                    data[field] = true;
                } else if (lowerValue === 'false' || lowerValue === 'f' || lowerValue === '0' || lowerValue === 'no' || lowerValue === 'n') {
                    data[field] = false;
                }
            }
        }
    }

    // Teisendame kuupäevad
    for (const field in data) {
        if (
            (field === 'createdAt' || field === 'date' || field === 'startDate' ||
                field === 'endDate' || field === 'time' || field === 'validUntil' ||
                field === 'dateOfBirth' || field === 'acceptedAt' || field === 'purchasedAt' ||
                field === 'signedAt' || field === 'verificationExpires' || field === 'resetTokenExpires') &&
            data[field] !== null && data[field] !== undefined && data[field] !== ''
        ) {
            // Kui on juba Date objekt, siis pole vaja teisendada
            if (!(data[field] instanceof Date)) {
                try {
                    data[field] = new Date(data[field]);
                } catch (e) {
                    console.error(`Kuupäeva teisendamine ebaõnnestus: ${field}=${data[field]}`, e);
                }
            }
        }
    }
}

/**
 * Asendab tühjad stringid null-iga
 */
function replaceEmptyStrings(data) {
    for (const key in data) {
        if (data[key] === '') {
            data[key] = null;
        }
    }
}

/**
 * Ettevalmistab relatsioonid Prisma jaoks
 */
function prepareRelations(data) {
    const cleanData = { ...data };
    const relations = {};

    // Otsime väljad, mis lõppevad ID-ga (v.a. 'id')
    const relationFields = Object.keys(cleanData).filter(key =>
        key !== 'id' && key.endsWith('Id') && cleanData[key] !== null && cleanData[key] !== undefined && cleanData[key] !== ''
    );

    // Iga leitud relationField jaoks loome relation objekti
    for (const field of relationFields) {
        const relationName = field.slice(0, -2); // Eemaldame 'Id' lõpu
        const relationValue = cleanData[field];

        // Teisendame väärtuse numbriks, kui see on numbriline string
        const parsedValue = !isNaN(relationValue) ? parseInt(relationValue, 10) : relationValue;

        // Loome relation objekti (nt { affiliate: { connect: { id: 1 } } })
        relations[relationName] = {
            connect: { id: parsedValue }
        };

        // Jätame ID välja alles, kuid teisendame selle numbriliseks
        cleanData[field] = parsedValue;
    }

    return { cleanData, relations };
}