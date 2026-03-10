const db = require('../config/db');

const Subscriber = {

    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM subscribers ORDER BY created_at DESC');
        return rows;
    },
    
    getPaginated: async (search, limit, offset) => {
        const querySearch = `%${search}%`;
        
        // 1. Fetch the specific slice of data
        // We use String() for limit/offset to ensure the driver handles them as numbers in the query
        const [rows] = await db.execute(
            `SELECT * FROM subscribers 
             WHERE email LIKE ? OR group_name LIKE ? 
             ORDER BY created_at DESC 
             LIMIT ${Number(limit)} OFFSET ${Number(offset)}`, 
            [querySearch, querySearch]
        );

        // 2. Fetch total count (Essential for frontend page numbers)
        const [countRes] = await db.execute(
            `SELECT COUNT(*) as total FROM subscribers 
             WHERE email LIKE ? OR group_name LIKE ?`,
            [querySearch, querySearch]
        );

        return {
            subscribers: rows,
            total: countRes[0].total
        };
    },
   

    create: async (email, group_name) => {
        const [result] = await db.execute('INSERT INTO subscribers (email, group_name) VALUES (?, ?)', 
            [email, group_name]);
        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM subscribers WHERE id = ?', [id]);
        return result.affectedRows;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM subscribers WHERE email = ?', [email]);
        return rows[0];
    }
    
};

module.exports = Subscriber;