import { pool } from "./database.js";

const seed = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS cars CASCADE;
    DROP TABLE IF EXISTS options CASCADE;

    CREATE TABLE options (
      id      SERIAL PRIMARY KEY,
      feature VARCHAR(50) NOT NULL,
      name    VARCHAR(50) NOT NULL,
      color   VARCHAR(50),
      price   NUMERIC DEFAULT 0
    );

    CREATE TABLE cars (
      id             SERIAL PRIMARY KEY,
      name           VARCHAR(100) DEFAULT 'My New Car',
      exterior_id    INT REFERENCES options(id),
      wheels_id      INT REFERENCES options(id),
      interior_id    INT REFERENCES options(id),
      roof_id        INT REFERENCES options(id),
      is_convertible BOOLEAN DEFAULT false,
      total_price    NUMERIC DEFAULT 50000
    );
  `);

  await pool.query(`
    INSERT INTO options (feature, name, color, price) VALUES
    -- Exterior: 10 màu như exemplar
    ('exterior', 'Silver',       '#C0C0C0', 3000),
    ('exterior', 'White',        '#F0F0F0', 3500),
    ('exterior', 'Dark Red',     '#8b0000', 5000),
    ('exterior', 'Gray',         '#808080', 3000),
    ('exterior', 'Orange',       '#FF8C00', 6000),
    ('exterior', 'Dark Brown',   '#3B1F0A', 4000),
    ('exterior', 'Black',        '#111111', 4000),
    ('exterior', 'Red',          '#FF0000', 5000),
    ('exterior', 'Yellow',       '#FFD700', 6500),
    ('exterior', 'Blue',         '#1E90FF', 4500),
    -- Wheels: 4 options
    ('wheels',   'Sport Black',  '#222222', 3000),
    ('wheels',   'Chrome',       '#C0C0C0', 4000),
    ('wheels',   'Gold',         '#FFD700', 5000),
    ('wheels',   'Standard',     '#888888', 2000),
    -- Interior: 4 options
    ('interior', 'Black Leather','#1a1a1a', 8000),
    ('interior', 'Red Leather',  '#8b0000', 9000),
    ('interior', 'White Leather','#f5f5f5', 9000),
    ('interior', 'Gray Fabric',  '#666666', 3000),
    -- Roof: 3 options
    ('roof',     'Sunroof',      '#87CEEB', 5000),
    ('roof',     'Black Top',    '#111111', 2000),
    ('roof',     'Standard',     '#333333', 0);
  `);

  console.log("✅ Done!");
  pool.end();
};

seed();
