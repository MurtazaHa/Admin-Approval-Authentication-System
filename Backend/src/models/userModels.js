const pool = require("../config/db");


const createUser = async (name, email, password, role = "individual") => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, password, role]
  );
  return result.rows[0];
};


const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const ApprovedUser = async (userId) => {
  const result = await pool.query("UPDATE users SET is_approved = true WHERE id = $1", [userId]);
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail, ApprovedUser };
