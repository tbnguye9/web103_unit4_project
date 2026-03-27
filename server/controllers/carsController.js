import { pool } from "../config/database.js";

// JOIN query dùng lại nhiều lần
const JOIN_QUERY = `
  SELECT 
    cars.*,
    e.name  AS exterior_name,  e.color AS exterior_color,  e.price AS exterior_price,  e.image_url AS exterior_image,
    w.name  AS wheels_name,    w.color AS wheels_color,    w.price AS wheels_price,    w.image_url AS wheels_image,
    i.name  AS interior_name,  i.color AS interior_color,  i.price AS interior_price,  i.image_url AS interior_image,
    r.name  AS roof_name,      r.color AS roof_color,      r.price AS roof_price,      r.image_url AS roof_image
  FROM cars
  LEFT JOIN options e ON cars.exterior_id = e.id
  LEFT JOIN options w ON cars.wheels_id   = w.id
  LEFT JOIN options i ON cars.interior_id = i.id
  LEFT JOIN options r ON cars.roof_id     = r.id
`;

export const getAllCars = async (req, res) => {
  try {
    const result = await pool.query(JOIN_QUERY + " ORDER BY cars.id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(JOIN_QUERY + " WHERE cars.id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const {
      name,
      exterior_id,
      wheels_id,
      interior_id,
      roof_id,
      is_convertible,
      total_price,
    } = req.body;

    // Validation: Convertible + Sunroof = invalid
    if (is_convertible && roof_id) {
      const roof = await pool.query("SELECT name FROM options WHERE id = $1", [
        roof_id,
      ]);
      if (roof.rows[0]?.name === "Sunroof") {
        return res.status(400).json({
          error: "❌ Convertible cannot have a Sunroof!",
        });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO cars 
        (name, exterior_id, wheels_id, interior_id,
         roof_id, is_convertible, total_price)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `,
      [
        name,
        exterior_id,
        wheels_id,
        interior_id,
        roof_id,
        is_convertible,
        total_price,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      exterior_id,
      wheels_id,
      interior_id,
      roof_id,
      is_convertible,
      total_price,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE cars SET
        name=$1, exterior_id=$2, wheels_id=$3,
        interior_id=$4, roof_id=$5,
        is_convertible=$6, total_price=$7
      WHERE id=$8 RETURNING *
    `,
      [
        name,
        exterior_id,
        wheels_id,
        interior_id,
        roof_id,
        is_convertible,
        total_price,
        id,
      ],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cars WHERE id = $1", [id]);
    res.json({ message: `Car ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
