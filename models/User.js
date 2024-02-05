const bcrypt = require('bcrypt');

const createUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const connection = await pool.getConnection();
    
    try {
        const result = await connection.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        console.log('User registered successfully!!');
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = createUser;