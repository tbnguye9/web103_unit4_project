import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars, deleteCar } from "../services/CarsAPI";
import "../App.css";

const ViewCars = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCars().then(setCars);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    await deleteCar(id);
    setCars(cars.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: "20px 60px" }}>
      {cars.length === 0 && (
        <div
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 60,
            fontSize: 18,
          }}
        >
          No cars yet!{" "}
          <span
            onClick={() => navigate("/")}
            style={{ color: "#e63946", cursor: "pointer" }}
          >
            Create one →
          </span>
        </div>
      )}

      {cars.map((car) => (
        <div
          key={car.id}
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "1px solid #333",
            borderRadius: 4,
            padding: "20px 24px",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Icon + Name */}
          <div
            style={{
              minWidth: 220,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 28 }}>🚗</span>
            <span style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {car.name}
            </span>
          </div>

          {/* Features 2x2 grid */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: 6,
              columnGap: 40,
            }}
          >
            <p style={{ color: "white", margin: 0, fontSize: 14 }}>
              🎨 <strong>Exterior:</strong> {car.exterior_name || "None"}
            </p>
            <p style={{ color: "white", margin: 0, fontSize: 14 }}>
              🛞 <strong>Wheels:</strong> {car.wheels_name || "None"}
            </p>
            <p style={{ color: "white", margin: 0, fontSize: 14 }}>
              😎 <strong>Roof:</strong> {car.roof_name || "None"}
            </p>
            <p style={{ color: "white", margin: 0, fontSize: 14 }}>
              🪑 <strong>Interior:</strong> {car.interior_name || "None"}
            </p>
          </div>

          {/* Price + DETAILS button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
              minWidth: 130,
            }}
          >
            <span style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              💰 ${Number(car.total_price).toLocaleString()}
            </span>
            <button
              onClick={() => navigate(`/customcars/${car.id}`)}
              style={{
                background: "#8b0000",
                color: "white",
                border: "none",
                padding: "8px 20px",
                fontWeight: "bold",
                cursor: "pointer",
                letterSpacing: 1,
                fontSize: 13,
                width: "100%",
              }}
            >
              DETAILS
            </button>
            <button
              onClick={() => handleDelete(car.id)}
              style={{
                background: "transparent",
                color: "#aaa",
                border: "1px solid #555",
                padding: "6px 20px",
                cursor: "pointer",
                fontSize: 12,
                width: "100%",
              }}
            >
              DELETE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewCars;
