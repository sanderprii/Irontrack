// client/src/adminApi.js
const API_URL = process.env.REACT_APP_API_URL || '';

export const adminApi = {
    /**
     * Kontrollib, kas kasutaja on administraator
     * @param {string} token - Autentimise token
     * @returns {Promise<Object>} - Kasutaja info
     */
    async checkAdminStatus(token) {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Autentimine ebaõnnestus: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Admin staatuse kontrollimine ebaõnnestus:', error);
            throw error;
        }
    },

    /**
     * Toob andmebaasi tabelite nimekirja
     * @param {string} token - Autentimise token
     * @returns {Promise<Array>} - Tabelite nimekiri
     */
    async getTables(token) {
        try {
            const response = await fetch(`${API_URL}/admin/tables`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Tabelite laadimine ebaõnnestus: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Tabelite laadimine ebaõnnestus:', error);
            throw error;
        }
    },

    /**
     * Toob tabeli andmed
     * @param {string} token - Autentimise token
     * @param {string} tableName - Tabeli nimi
     * @param {number} page - Lehekülje number
     * @param {number} limit - Ridade arv lehel
     * @returns {Promise<Object>} - Tabeli andmed, veerud ja ridade koguarv
     */
    async getTableData(token, tableName, page, limit) {
        try {
            if (!tableName) {
                throw new Error('Tabeli nimi on puudu');
            }

            // Kontrolli, et page ja limit on positiivsed numbrid
            const pageNum = Math.max(0, parseInt(page) || 0);
            const limitNum = Math.max(1, parseInt(limit) || 10);

            const response = await fetch(`${API_URL}/admin/tables/${tableName}?page=${pageNum}&limit=${limitNum}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Andmete laadimine ebaõnnestus: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Tabeli ${tableName} andmete laadimine ebaõnnestus:`, error);
            throw error;
        }
    },

    /**
     * Uuendab tabeli rida
     * @param {string} token - Autentimise token
     * @param {string} tableName - Tabeli nimi
     * @param {Object} rowData - Rea andmed
     * @returns {Promise<Object>} - Uuendatud rea andmed
     */
    async updateRow(token, tableName, rowData) {
        try {
            if (!tableName) {
                throw new Error('Tabeli nimi on puudu');
            }

            if (!rowData || Object.keys(rowData).length === 0) {
                throw new Error('Rea andmed on puudu');
            }

            // Logime andmed silumiseks
            console.log('Uuendatavad andmed:', rowData);

            // Teeme kindlaks, et primaarvõti on olemas (eeldame, et see on 'id')
            const primaryKeyField = 'id';
            if (!rowData[primaryKeyField]) {
                throw new Error(`Primaarvõti (${primaryKeyField}) puudub andmetes`);
            }

            // Teeme andmetest puhtama koopia, eemaldades tühjad sõned
            const cleanedData = { ...rowData };
            for (const key in cleanedData) {
                if (cleanedData[key] === '') {
                    cleanedData[key] = null;
                }
            }

            // Teeme PUT päringu andmete uuendamiseks
            // Lisame primaarvõtme URL-i
            const url = `${API_URL}/admin/tables/${tableName}/${cleanedData[primaryKeyField]}`;
            console.log('Saadame päringu URL-ile:', url);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Serveri veateade:', errorData);
                throw new Error(errorData.error || `Rea uuendamine ebaõnnestus: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Rea uuendamine tabelis ${tableName} ebaõnnestus:`, error);
            throw error;
        }
    },

    /**
     * Lisab tabelisse uue rea
     * @param {string} token - Autentimise token
     * @param {string} tableName - Tabeli nimi
     * @param {Object} rowData - Rea andmed
     * @returns {Promise<Object>} - Lisatud rea andmed
     */
    async addRow(token, tableName, rowData) {
        try {
            if (!tableName) {
                throw new Error('Tabeli nimi on puudu');
            }

            if (!rowData || Object.keys(rowData).length === 0) {
                throw new Error('Rea andmed on puudu');
            }

            // Teeme andmetest puhtama koopia, eemaldades tühjad sõned
            const cleanedData = { ...rowData };
            for (const key in cleanedData) {
                if (cleanedData[key] === '') {
                    cleanedData[key] = null;
                }
            }

            const response = await fetch(`${API_URL}/admin/tables/${tableName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Rea lisamine ebaõnnestus: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Rea lisamine tabelisse ${tableName} ebaõnnestus:`, error);
            throw error;
        }
    },

    /**
     * Kustutab tabelist rea
     * @param {string} token - Autentimise token
     * @param {string} tableName - Tabeli nimi
     * @param {Object} rowData - Rea andmed
     * @returns {Promise<Object>} - Vastus serverilt
     */
    async deleteRow(token, tableName, rowData) {
        try {
            if (!tableName) {
                throw new Error('Tabeli nimi on puudu');
            }

            if (!rowData || !rowData.id) {
                throw new Error('Rea ID on puudu');
            }

            const response = await fetch(`${API_URL}/admin/tables/${tableName}/${rowData.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Rea kustutamine ebaõnnestus: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Rea kustutamine tabelist ${tableName} ebaõnnestus:`, error);
            throw error;
        }
    },

    /**
     * Toob tabeli primaarvõtme nime
     * @param {string} token - Autentimise token
     * @param {string} tableName - Tabeli nimi
     * @returns {Promise<string>} - Primaarvõtme nimi
     */
    async getTablePrimaryKey(token, tableName) {
        try {
            if (!tableName) {
                throw new Error('Tabeli nimi on puudu');
            }

            const response = await fetch(`${API_URL}/admin/tables/${tableName}/primary-key`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Primaarvõtme laadimine ebaõnnestus: ${response.status}`);
            }

            const data = await response.json();
            return data.primaryKey;
        } catch (error) {
            console.error(`Tabeli ${tableName} primaarvõtme laadimine ebaõnnestus:`, error);
            // Vaikimisi tagastame 'id', mis on enamasti primaarvõti
            return 'id';
        }
    }
};