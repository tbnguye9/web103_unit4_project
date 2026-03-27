import { pool } from "../config/database.js";

export const getAllOptions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM options ORDER BY feature, id",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
