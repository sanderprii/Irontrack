// Täielik administratiivne kontroller, mis toetab mõlemat URL stiili
// Lisa see failina server/src/controllers/adminController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lisame debug režiimi
const DEBUG = true;

/**
 * Tagastab kõik andmebaasi tabelid
 */
exports.getTables = async (req, res) => {
    try {
        if (DEBUG) console.log('Päritakse andmebaasi tabeleid');

        // Prisma databaseUrl sisaldab andmebaasi tüüpi
        const dbType = process.env.DATABASE_URL?.includes('postgresql') ? 'postgresql' : 'mysql';

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

        // Teine valik - vastavalt andmebaasi tüübile erinevad päringud
        try {
            let tableNames;

            if (dbType === 'postgresql') {
                // PostgreSQL tabelid
                const result = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `;
                tableNames = result.map(row => row.table_name);
            } else {
                // MySQL tabelid
                const result = await prisma.$queryRaw`
          SHOW TABLES;
        `;
                tableNames = result.map(row => Object.values(row)[0]);
            }

            if (DEBUG) console.log('Tagastan SQL päringuga leitud tabelid:', tableNames);
            return res.json(tableNames);
        } catch (sqlError) {
            console.error('SQL päring tabelite jaoks ebaõnnestus:', sqlError);
        }

        // Kui kumbki meetod ei töötanud, tagastame staatilise nimekirja
        const staticTables = [
            'User', 'Affiliate', 'AffiliateTrainer', 'ClassSchedule', 'ClassAttendee',
            'Plan', 'UserPlan', 'Record', 'Training', 'Exercise', 'Contract',
            'SignedContract', 'Message', 'Credit', 'defaultWOD', 'ClassLeaderboard',
            'Members', 'todayWOD', 'transactions', 'PaymentHoliday', 'ContractLogs'
        ];

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
        const { tableName } = req.params;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 100;
        const offset = page * limit;

        if (DEBUG) console.log(`Päritakse tabeli ${tableName} andmeid, lehekülg ${page}, limiit ${limit}`);

        // Kontrollime, kas tabel on lubatud
        const validTables = await getValidTables();
        if (!validTables.includes(tableName)) {
            if (DEBUG) console.log(`Tabelit ${tableName} ei leitud lubatud tabelite hulgast:`, validTables);
            return res.status(404).json({ error: 'Tabelit ei leitud' });
        }

        // Proovime kõigepealt Prisma API-d
        if (prisma[tableName] && typeof prisma[tableName].findMany === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d tabeli ${tableName} pärimiseks`);

                // Loeme andmed Prisma API-ga
                const data = await prisma[tableName].findMany({
                    skip: offset,
                    take: limit
                });

                // Loeme metaandmed
                const totalRows = await prisma[tableName].count();

                // Saame veergude nimed esimesest andmeobjektist
                const columns = data.length > 0 ? Object.keys(data[0]) : [];

                // Määrame nõutud väljad (võtame lihtsalt id välja praegu)
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

            // Saame tabeli struktuuri
            const columnsInfo = await getTableColumns(tableName);
            const columns = columnsInfo.map(col => col.name);

            // Toome välja nõutud väljad
            const requiredFields = columnsInfo
                .filter(col => !col.isNullable && !col.hasDefaultValue && !col.isAutoincrement)
                .map(col => col.name);

            // Andmed
            const data = await prisma.$queryRaw`
        SELECT * FROM ${prisma.raw(`"${tableName}"`)}
        LIMIT ${limit} OFFSET ${offset}
      `;

            // Ridade koguarv
            const countResult = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM ${prisma.raw(`"${tableName}"`)}
      `;
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

            // Kui midagi ei tööta, tagastame vähemalt tühja vastuse
            return res.json({
                columns: [],
                data: [],
                totalRows: 0,
                requiredFields: []
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
        const { tableName } = req.params;

        if (DEBUG) console.log(`Päritakse tabeli ${tableName} primaarvõtit`);

        // Kasutame Prisma API-d, kui võimalik
        if (prisma[tableName] && typeof prisma[tableName].findMany === 'function') {
            // Prisma mudelite puhul on primaarvõti tavaliselt "id"
            // kui pole defineeritud teisiti
            return res.json({ primaryKey: "id" });
        }

        // Kontrollime, kas tabel on lubatud
        const validTables = await getValidTables();
        if (!validTables.includes(tableName)) {
            return res.status(404).json({ error: 'Tabelit ei leitud' });
        }

        try {
            // Saame tabeli struktuuri, et leida primaarvõti
            const columnsInfo = await getTableColumns(tableName);
            const primaryKeyColumn = columnsInfo.find(col => col.isPrimary);

            if (!primaryKeyColumn) {
                // Kui ei leia primaarvõtit, eeldame, et see on "id"
                return res.json({ primaryKey: "id" });
            }

            res.json({ primaryKey: primaryKeyColumn.name });
        } catch (sqlError) {
            console.error('SQL päring primaarvõtme jaoks ebaõnnestus:', sqlError);
            // Paljudel tabelitel on primaarvõti "id"
            return res.json({ primaryKey: "id" });
        }
    } catch (error) {
        console.error('Viga primaarvõtme pärimisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

/**
 * Uuendab tabeli rida - TÄHELEPANU: Toetame nii /tableName/:id kui ka /tableName marsruute
 * See on universaalne meetod, mis peaks töötama igasuguste pöördumiste korral
 */
exports.updateRow = async (req, res) => {
    try {
        const { tableName } = req.params;
        // ID võib tulla kas URL-ist või päringust
        const id = req.params.id || req.body.id;
        const rowData = req.body;

        if (DEBUG) {
            console.log(`Uuendame rida tabelis ${tableName}, ID: ${id}`);
            console.log('Päringu params:', req.params);
            console.log('Päringu body:', req.body);
        }

        // Kontrollime, kas tabel on lubatud
        const validTables = await getValidTables();
        if (!validTables.includes(tableName)) {
            return res.status(404).json({ error: 'Tabelit ei leitud' });
        }

        // Kui ID puudub täielikult, kontrollime, kas kehas on mõni muu primaarvõti
        let primaryKeyField = 'id';
        let primaryKeyValue = id;

        if (!primaryKeyValue && tableName) {
            if (DEBUG) console.log('ID puudub, otsime alternatiivset primaarvõtit rowData andmetest');

            // Proovime leida mõni ID-ga sarnane väli
            const possibleKeyFields = Object.keys(rowData).filter(key =>
                key.toLowerCase().includes('id')
            );

            if (possibleKeyFields.length > 0) {
                primaryKeyField = possibleKeyFields[0];
                primaryKeyValue = rowData[primaryKeyField];
                if (DEBUG) console.log(`Leidsime alternatiivse primaarvõtme: ${primaryKeyField} = ${primaryKeyValue}`);
            }
        }

        if (!primaryKeyValue) {
            return res.status(400).json({ error: 'Primaarvõti puudub. Ei saa rida uuendada.' });
        }

        // Katsetame Prisma API-d
        if (prisma[tableName] && typeof prisma[tableName].update === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d rea uuendamiseks tabelis ${tableName}`);

                // Uuendame rea koopiaga päringust ilma ID-ta
                const updateData = { ...rowData };
                // Eemaldame id välja, et vältida konflikte
                if (updateData.id !== undefined) {
                    delete updateData.id;
                }

                const updatedRow = await prisma[tableName].update({
                    where: { [primaryKeyField]: parseInt(primaryKeyValue) || primaryKeyValue },
                    data: updateData
                });

                if (DEBUG) console.log('Uuendamine õnnestus Prisma API-ga:', updatedRow);
                return res.json(updatedRow);
            } catch (prismaError) {
                console.error('Prisma API viga:', prismaError);
                // Jätkame SQL lähenemisega
            }
        }

        // Proovime SQL päringut
        try {
            if (DEBUG) console.log('Kasutan SQL päringut rea uuendamiseks');

            // Koostame UPDATE päring
            const setClauses = [];
            const values = [];
            let paramCounter = 1;

            // Koostame SET klausi dünaamiliselt, välja arvatud primaarvõti
            Object.entries(rowData).forEach(([key, value]) => {
                if (key !== primaryKeyField) {
                    setClauses.push(`"${key}" = $${paramCounter}`);
                    values.push(value);
                    paramCounter++;
                }
            });

            // Lisame WHERE tingimuse parameetri
            values.push(primaryKeyValue);

            // Moodustame päringu
            const query = `
        UPDATE "${tableName}" 
        SET ${setClauses.join(', ')} 
        WHERE "${primaryKeyField}" = $${paramCounter} 
        RETURNING *
      `;

            if (DEBUG) {
                console.log('SQL päring:', query);
                console.log('Parameetrid:', values);
            }

            // Teostame päringu
            const result = await prisma.$queryRaw(query, ...values);

            if (!result || result.length === 0) {
                if (DEBUG) console.log('SQL päring ei tagastanud tulemusi');
                return res.status(404).json({ error: 'Rida ei leitud või uuendamine ebaõnnestus' });
            }

            if (DEBUG) console.log('SQL päring õnnestus, tulemus:', result[0]);
            return res.json(result[0]);
        } catch (sqlError) {
            console.error('SQL viga:', sqlError);
            return res.status(500).json({ error: 'SQL viga: ' + sqlError.message });
        }
    } catch (error) {
        console.error('Viga rea uuendamisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

// Modify this function in server/src/controllers/adminController.js

/**
 * Lisab tabelisse uue rea
 */
exports.addRow = async (req, res) => {
    try {
        const { tableName } = req.params;
        const rowData = req.body;

        console.log(`Lisame rea tabelisse ${tableName}`);
        console.log('Andmed:', rowData);

        // Kontrollime, kas tabel on lubatud
        const validTables = await getValidTables();
        if (!validTables.includes(tableName)) {
            return res.status(404).json({ error: 'Tabelit ei leitud' });
        }

        // Convert table name to both PascalCase and camelCase for Prisma
        // Prisma models are PascalCase but accessed with camelCase
        const pascalCaseTableName = tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase();
        const camelCaseTableName = tableName.charAt(0).toLowerCase() + tableName.slice(1).toLowerCase();

        // Use the correct table name based on what exists in the Prisma client
        const prismaModelName = prisma[pascalCaseTableName] ? pascalCaseTableName :
            (prisma[camelCaseTableName] ? camelCaseTableName : tableName);

        // Force convert id to integer regardless of schema inspection
        const convertedData = { ...rowData };

        // These are common fields that are usually integers in databases
        const integerFields = ['id', 'affiliateId', 'recipientId', 'userId', 'planId', 'contractId',
            'trainerId', 'classId', 'trainingId', 'groupId', 'memberId', 'creditId'];

        // Convert known integer fields from strings to integers
        for (const field of integerFields) {
            if (convertedData[field] !== undefined && convertedData[field] !== null && convertedData[field] !== '') {
                convertedData[field] = parseInt(convertedData[field], 10);
                console.log(`Converted ${field} from ${rowData[field]} to ${convertedData[field]}`);
            }
        }

        // Handle empty strings
        for (const key in convertedData) {
            if (convertedData[key] === '') {
                convertedData[key] = null;
            }
        }

        // Remove createdAt if null to use default value from schema
        if (convertedData.createdAt === null) {
            delete convertedData.createdAt;
        }

        console.log('Converted data for insertion:', convertedData);

        // Try to automatically set up relations based on ID fields
        try {
            console.log(`Trying to create row with relations for ${prismaModelName}`);

            // Prepare data with relations
            const dataWithRelations = { ...convertedData };
            const relationData = {};

            // Get common relation fields based on ID suffix
            const possibleRelations = {};

            for (const key in dataWithRelations) {
                // Check if field ends with Id (excluding 'id' itself) to detect foreign keys
                if (key !== 'id' && key.endsWith('Id')) {
                    const relationName = key.slice(0, -2).toLowerCase(); // e.g., affiliateId -> affiliate
                    possibleRelations[relationName] = dataWithRelations[key];
                }
            }

            // Create relation objects
            for (const [relation, id] of Object.entries(possibleRelations)) {
                if (id !== null && id !== undefined) {
                    // For a relation field like "affiliateId", add "affiliate: { connect: { id: X } }"
                    relationData[relation] = {
                        connect: { id }
                    };
                }
            }

            // Remove ID fields to avoid duplicate data
            for (const key of Object.keys(possibleRelations)) {
                const idField = `${key}Id`;
                if (dataWithRelations[idField] !== undefined) {
                    delete dataWithRelations[idField];
                }
            }

            // Combine regular data with relation data
            const finalData = {
                ...dataWithRelations,
                ...relationData
            };

            console.log('Final data with relations:', finalData);

            const newRow = await prisma[prismaModelName].create({
                data: finalData
            });

            console.log('Row creation successful with relations:', newRow);
            return res.status(201).json(newRow);
        } catch (relationError) {
            console.error('Creation with relations failed:', relationError);
            // Continue to next approach if this fails
        }

        // Try Prisma create without relations
        if (prisma[prismaModelName] && typeof prisma[prismaModelName].create === 'function') {
            try {
                console.log(`Kasutan Prisma API-d rea lisamiseks tabelisse ${prismaModelName}`);

                const newRow = await prisma[prismaModelName].create({
                    data: convertedData
                });

                console.log('Rea lisamine õnnestus Prisma API-ga:', newRow);
                return res.status(201).json(newRow);
            } catch (prismaError) {
                console.error('Prisma API viga:', prismaError);
                // Continue to next approach
            }
        }

        // Try Prisma createMany
        try {
            console.log('Kasutan otsest rea sisestamise meetodit');

            const result = await prisma[prismaModelName].createMany({
                data: [convertedData],
                skipDuplicates: true
            });

            if (result && result.count > 0) {
                // Return created row
                return res.status(201).json({
                    ...convertedData,
                    _created: true,
                    count: result.count
                });
            }

            throw new Error('Rea loomine ei õnnestunud');
        } catch (directError) {
            console.error('Otsene sisestamine ebaõnnestus:', directError);

            // One last attempt without the id field if it might be auto-incremented
            try {
                console.log('Proovime lisada ilma ID väljata (autoincrement võimalus)');

                const dataWithoutId = { ...convertedData };
                if ('id' in dataWithoutId) {
                    delete dataWithoutId.id;
                }

                // Try again with the relations approach but without ID
                try {
                    // Prepare data with relations
                    const relationData = {};

                    // Get common relation fields based on ID suffix
                    const possibleRelations = {};

                    for (const key in dataWithoutId) {
                        // Check if field ends with Id (excluding 'id' itself)
                        if (key !== 'id' && key.endsWith('Id')) {
                            const relationName = key.slice(0, -2).toLowerCase();
                            possibleRelations[relationName] = dataWithoutId[key];
                        }
                    }

                    // Create relation objects
                    for (const [relation, id] of Object.entries(possibleRelations)) {
                        if (id !== null && id !== undefined) {
                            relationData[relation] = {
                                connect: { id }
                            };
                        }
                    }

                    // Remove ID fields to avoid duplicate data
                    for (const key of Object.keys(possibleRelations)) {
                        const idField = `${key}Id`;
                        if (dataWithoutId[idField] !== undefined) {
                            delete dataWithoutId[idField];
                        }
                    }

                    // Combine regular data with relation data
                    const finalData = {
                        ...dataWithoutId,
                        ...relationData
                    };

                    const newRow = await prisma[prismaModelName].create({
                        data: finalData
                    });

                    console.log('Rea lisamine õnnestus ilma ID-ta ja relatsioonidega:', newRow);
                    return res.status(201).json(newRow);
                } catch (finalRelationError) {
                    console.error('Relatsioonidega lisamine ilma ID-ta ebaõnnestus:', finalRelationError);

                    // Last attempt with plain data without ID
                    const newRow = await prisma[prismaModelName].create({
                        data: dataWithoutId
                    });

                    console.log('Rea lisamine õnnestus ilma ID-ta:', newRow);
                    return res.status(201).json(newRow);
                }
            } catch (finalError) {
                console.error('Kõik katsed ebaõnnestusid:', finalError);
                return res.status(500).json({
                    error: 'Rea lisamine ebaõnnestus kõigi meetoditega',
                    details: finalError.message
                });
            }
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
        const { tableName, id } = req.params;

        if (DEBUG) console.log(`Kustutame rea tabelist ${tableName}, ID: ${id}`);

        // Kontrollime, kas tabel on lubatud
        const validTables = await getValidTables();
        if (!validTables.includes(tableName)) {
            return res.status(404).json({ error: 'Tabelit ei leitud' });
        }

        // Kontrollime ID olemasolu
        if (!id) {
            return res.status(400).json({ error: 'Puudub rea ID' });
        }

        // Kasutame Prisma API-d, kui võimalik
        if (prisma[tableName] && typeof prisma[tableName].delete === 'function') {
            try {
                if (DEBUG) console.log(`Kasutan Prisma API-d rea kustutamiseks tabelist ${tableName}`);

                const deletedRow = await prisma[tableName].delete({
                    where: { id: parseInt(id) || id }
                });

                if (DEBUG) console.log('Rea kustutamine õnnestus Prisma API-ga:', deletedRow);
                return res.json({ message: 'Rida edukalt kustutatud', deletedRow });
            } catch (prismaError) {
                console.error('Prisma API viga:', prismaError);
                // Jätkame SQL lähenemisega
            }
        }

        // Proovime SQL päringut
        try {
            if (DEBUG) console.log('Kasutan SQL päringut rea kustutamiseks');

            // DELETE päring
            const query = `
        DELETE FROM "${tableName}"
        WHERE "id" = $1
        RETURNING *
      `;

            if (DEBUG) {
                console.log('SQL päring:', query);
                console.log('Parameeter:', id);
            }

            const result = await prisma.$queryRaw(query, id);

            if (!result || result.length === 0) {
                if (DEBUG) console.log('SQL päring ei tagastanud tulemusi');
                return res.status(404).json({ error: 'Rida ei leitud' });
            }

            if (DEBUG) console.log('SQL päring õnnestus, kustutatud rida:', result[0]);
            return res.json({ message: 'Rida edukalt kustutatud', deletedRow: result[0] });
        } catch (sqlError) {
            console.error('SQL viga:', sqlError);
            return res.status(500).json({ error: 'SQL viga: ' + sqlError.message });
        }
    } catch (error) {
        console.error('Viga rea kustutamisel:', error);
        res.status(500).json({ error: 'Andmebaasi päring ebaõnnestus: ' + error.message });
    }
};

// Helper functions

/**
 * Tagastab kõik lubatud tabelid
 */
async function getValidTables() {
    try {
        // Kõigepealt proovime Prisma API-d
        const dataModels = Object.keys(prisma).filter(key =>
            !key.startsWith('_') &&
            typeof prisma[key] === 'object' &&
            prisma[key] !== null &&
            typeof prisma[key].findMany === 'function'
        );

        if (dataModels.length > 0) {
            return dataModels;
        }

        // Siis proovime SQL päringut
        try {
            const dbType = process.env.DATABASE_URL?.includes('postgresql') ? 'postgresql' : 'mysql';

            if (dbType === 'postgresql') {
                const result = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE';
        `;
                return result.map(row => row.table_name);
            } else {
                const result = await prisma.$queryRaw`SHOW TABLES;`;
                return result.map(row => Object.values(row)[0]);
            }
        } catch (sqlError) {
            console.error('SQL päring tabelite nimekirja saamiseks ebaõnnestus:', sqlError);
        }

        // Viimase abinõuna tagastame staatilise nimekirja
        return [
            'User', 'Affiliate', 'AffiliateTrainer', 'ClassSchedule', 'ClassAttendee',
            'Plan', 'UserPlan', 'Record', 'Training', 'Exercise', 'Contract',
            'SignedContract', 'Message', 'Credit', 'defaultWOD', 'ClassLeaderboard',
            'Members', 'todayWOD', 'transactions', 'PaymentHoliday', 'ContractLogs',
            'message'
        ];
    } catch (error) {
        console.error('Viga tabelite nimekirja pärimisel:', error);
        // Tagastame tühja massiivi, et vältida täiendavaid vigu
        return [];
    }
}

/**
 * Tagastab tabeli veergude info
 */
async function getTableColumns(tableName) {
    try {
        const dbType = process.env.DATABASE_URL?.includes('postgresql') ? 'postgresql' : 'mysql';

        if (dbType === 'postgresql') {
            const result = await prisma.$queryRaw`
                SELECT
                    column_name as "name",
                    data_type as "type",
                    is_nullable = 'NO' as "isNullable",
                    column_default IS NOT NULL as "hasDefaultValue",
                    case when pg_get_serial_sequence(quote_ident(${tableName}), column_name) IS NOT NULL
                             then true else false end as "isAutoincrement",
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
        } else {
            const result = await prisma.$queryRaw`
        SHOW COLUMNS FROM ${prisma.raw(tableName)};
      `;
            return result.map(col => ({
                name: col.Field,
                type: col.Type.split('(')[0],
                isNullable: col.Null === 'YES',
                hasDefaultValue: col.Default !== null,
                isAutoincrement: col.Extra.includes('auto_increment'),
                isPrimary: col.Key === 'PRI'
            }));
        }
    } catch (error) {
        console.error(`Viga tabeli ${tableName} veergude pärimisel:`, error);
        // Tagastame tühja massiivi vältimaks täiendavaid vigu
        return [];
    }
}