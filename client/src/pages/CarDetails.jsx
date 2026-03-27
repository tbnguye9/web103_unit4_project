import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, deleteCar } from "../services/CarsAPI";
import "../App.css";

const FeatureBox = ({ label, name, color, emoji, price, imageUrl }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        minHeight: 200,
        background: "#1a1a1a",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Ảnh option */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || label}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 200,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        // Fallback: nếu không có ảnh thì dùng ô màu như cũ
        <div
          style={{
            width: "100%",
            minHeight: 200,
            background: color || "#333",
          }}
        />
      )}

      {/* Hover overlay với thông tin */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            zIndex: 2,
          }}
        >
          <p
            style={{
              color: "white",
              margin: 0,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {emoji} <strong>{label}:</strong> {name || "N/A"}
          </p>
          {/* Hiển thị ô màu nhỏ kèm hex code */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: color || "#333",
                border: "1px solid #fff",
              }}
            />
            <span style={{ color: "#ccc", fontSize: 13 }}>{color}</span>
          </div>
          <p style={{ color: "#4caf50", margin: 0, fontSize: 14 }}>
            💵 ${Number(price || 0).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCarById(id).then(setCar);
  }, [id]);

  if (!car) return <p style={{ color: "white", padding: 40 }}>Loading...</p>;

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.6)",
        margin: "0 60px",
        padding: "24px 30px",
      }}
    >
      {/* Header: icon + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 28 }}>🚗</span>
        <h2 style={{ color: "white", margin: 0, fontSize: 26 }}>{car.name}</h2>
      </div>

      {/* Price + EDIT + DELETE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <span style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
          💰 ${Number(car.total_price).toLocaleString()}
        </span>
        <button
          onClick={() => navigate(`/edit/${id}`)}
          style={{
            background: "#8b0000",
            color: "white",
            border: "none",
            padding: "10px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          EDIT
        </button>
        <button
          onClick={async () => {
            if (!window.confirm("Delete this car?")) return;
            await deleteCar(id);
            navigate("/customcars");
          }}
          style={{
            background: "#8b0000",
            color: "white",
            border: "none",
            padding: "10px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          DELETE
        </button>
      </div>

      {/* 2x2 Feature grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          maxWidth: 860,
        }}
      >
        <FeatureBox
          label="Exterior"
          emoji="🎨"
          name={car.exterior_name}
          color={car.exterior_color}
          price={car.exterior_price}
          imageUrl={car.exterior_image}
        />
        <FeatureBox
          label="Roof"
          emoji="😎"
          name={car.roof_name}
          color={car.roof_color}
          price={car.roof_price}
          imageUrl={car.roof_image}
        />
        <FeatureBox
          label="Wheels"
          emoji="🛞"
          name={car.wheels_name}
          color={car.wheels_color}
          price={car.wheels_price}
          imageUrl={car.wheels_image}
        />
        <FeatureBox
          label="Interior"
          emoji="🪑"
          name={car.interior_name}
          color={car.interior_color}
          price={car.interior_price}
          imageUrl={car.interior_image}
        />
      </div>

      <p style={{ color: "#aaa", marginTop: 10, fontSize: 13 }}>
        {car.is_convertible ? "🚗 Convertible" : "🚙 Coupe"}
      </p>

      <button
        onClick={() => navigate("/customcars")}
        style={{
          marginTop: 12,
          background: "transparent",
          color: "#aaa",
          border: "1px solid #555",
          padding: "8px 20px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default CarDetails;
