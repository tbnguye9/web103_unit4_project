import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOptions } from "../services/OptionsAPI";
import { createCar } from "../services/CarsAPI";
import { calculatePrice } from "../utilities/calcPrice";
import { validateCombination } from "../utilities/validation";
import "../App.css";

const CreateCar = () => {
  const [options, setOptions] = useState({});
  const [selected, setSelected] = useState({
    exterior: null,
    wheels: null,
    interior: null,
    roof: null,
  });
  const [activeFeature, setActiveFeature] = useState(null);
  const [isConvertible, setIsConvertible] = useState(false);
  const [carName, setCarName] = useState("My New Car");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllOptions().then((data) => {
      const grouped = data.reduce((acc, opt) => {
        if (!acc[opt.feature]) acc[opt.feature] = [];
        acc[opt.feature].push(opt);
        return acc;
      }, {});
      setOptions(grouped);
    });
  }, []);

  const price = calculatePrice(selected, isConvertible);

  const handleSelect = (feature, opt) => {
    setSelected((prev) => ({ ...prev, [feature]: opt }));
    setError("");
  };

  const handleSubmit = async () => {
    const { valid, message } = validateCombination(
      isConvertible,
      selected.roof?.name,
    );
    if (!valid) {
      setError(message);
      return;
    }

    const result = await createCar({
      name: carName,
      exterior_id: selected.exterior?.id || null,
      wheels_id: selected.wheels?.id || null,
      interior_id: selected.interior?.id || null,
      roof_id: selected.roof?.id || null,
      is_convertible: isConvertible,
      total_price: price,
    });

    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/customcars");
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* ROW 1: Controls bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 24px",
          background: "rgba(0,0,0,0.5)",
          flexWrap: "nowrap",
        }}
      >
        <label
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={isConvertible}
            onChange={(e) => setIsConvertible(e.target.checked)}
          />
          Convertible
        </label>

        {["exterior", "roof", "wheels", "interior"].map((feature) => (
          <button
            key={feature}
            onClick={() =>
              setActiveFeature((prev) => (prev === feature ? null : feature))
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#000";
              e.currentTarget.style.border = "1px solid white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                activeFeature === feature ? "#a00" : "#8b0000";
              e.currentTarget.style.border = "none";
            }}
            style={{
              background: activeFeature === feature ? "#a00" : "#8b0000",
              color: "white",
              border: "none",
              padding: "14px 30px",
              fontWeight: "bold",
              fontSize: 15,
              cursor: "pointer",
              letterSpacing: 2,
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
          >
            {feature.toUpperCase()}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <input
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          style={{
            padding: "14px 16px",
            background: "rgba(20,20,20,0.9)",
            border: "1px solid #444",
            color: "white",
            fontSize: 14,
            width: 180,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSubmit}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#000";
            e.currentTarget.style.border = "1px solid white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#8b0000";
            e.currentTarget.style.border = "none";
          }}
          style={{
            background: "#8b0000",
            color: "white",
            border: "none",
            padding: "14px 30px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
            letterSpacing: 2,
            transition: "background 0.2s",
          }}
        >
          CREATE
        </button>
      </div>

      {/* Option picker popup */}
      {activeFeature && (
        <>
          <div
            onClick={() => setActiveFeature(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 200,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(10,10,10,0.97)",
              border: "2px solid #8b0000",
              padding: "36px 40px",
              display: "flex",
              alignItems: "center",
              gap: 32,
              zIndex: 300,
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
              minWidth: 600,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 100px)",
                gap: 14,
              }}
            >
              {(options[activeFeature] || []).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    handleSelect(activeFeature, opt);
                  }}
                  title={opt.name}
                  style={{
                    width: 100,
                    height: 100,
                    cursor: "pointer",
                    borderRadius: 4,
                    border:
                      selected[activeFeature]?.id === opt.id
                        ? "4px solid white"
                        : "4px solid transparent",
                    boxShadow:
                      selected[activeFeature]?.id === opt.id
                        ? "0 0 14px rgba(255,255,255,0.6)"
                        : "none",
                    transition: "border 0.15s, box-shadow 0.15s",
                    overflow: "hidden",
                    position: "relative",
                    background: opt.color || "#333",
                  }}
                >
                  {/* Hình ảnh từ image_url */}
                  {opt.image_url && (
                    <img
                      src={opt.image_url}
                      alt={opt.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                  {/* Label tên hiện ở dưới */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      fontSize: 9,
                      textAlign: "center",
                      padding: "2px 0",
                      letterSpacing: 0.5,
                    }}
                  >
                    {opt.name}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveFeature(null)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c00")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#8b0000")
              }
              style={{
                background: "#8b0000",
                color: "white",
                border: "none",
                padding: "16px 32px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
                letterSpacing: 2,
                borderRadius: 2,
              }}
            >
              DONE
            </button>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#5c0000",
            color: "white",
            padding: "10px 24px",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Price - góc dưới trái */}
      <div
        style={{
          position: "fixed",
          bottom: 40,
          left: 30,
          background: "#8b0000",
          color: "white",
          padding: "14px 32px",
          fontSize: 24,
          fontWeight: "bold",
          borderRadius: 4,
          zIndex: 100,
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        💰 ${price.toLocaleString()}
      </div>
    </div>
  );
};

export default CreateCar;
