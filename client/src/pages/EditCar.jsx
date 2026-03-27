import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, updateCar, deleteCar } from "../services/CarsAPI";
import { getAllOptions } from "../services/OptionsAPI";
import { calculatePrice } from "../utilities/calcPrice";
import { validateCombination } from "../utilities/validation";
import "../App.css";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState({});
  const [selected, setSelected] = useState({
    exterior: null,
    wheels: null,
    interior: null,
    roof: null,
  });
  const [activeFeature, setActiveFeature] = useState(null);
  const [isConvertible, setIsConvertible] = useState(false);
  const [carName, setCarName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCarById(id), getAllOptions()]).then(([car, opts]) => {
      setCarName(car.name);
      setIsConvertible(car.is_convertible);
      const grouped = opts.reduce((acc, opt) => {
        if (!acc[opt.feature]) acc[opt.feature] = [];
        acc[opt.feature].push(opt);
        return acc;
      }, {});
      setOptions(grouped);
      setSelected({
        exterior: opts.find((o) => o.id === car.exterior_id) || null,
        wheels: opts.find((o) => o.id === car.wheels_id) || null,
        interior: opts.find((o) => o.id === car.interior_id) || null,
        roof: opts.find((o) => o.id === car.roof_id) || null,
      });
    });
  }, [id]);

  const price = calculatePrice(selected, isConvertible);

  const handleSubmit = async () => {
    const { valid, message } = validateCombination(
      isConvertible,
      selected.roof?.name,
    );
    if (!valid) {
      setError(message);
      return;
    }

    await updateCar(id, {
      name: carName,
      exterior_id: selected.exterior?.id || null,
      wheels_id: selected.wheels?.id || null,
      interior_id: selected.interior?.id || null,
      roof_id: selected.roof?.id || null,
      is_convertible: isConvertible,
      total_price: price,
    });
    navigate(`/customcars/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this car?")) return;
    await deleteCar(id);
    navigate("/customcars");
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* ROW 1: Controls bar — giống hệt CreateCar */}
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
        {/* Convertible */}
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

        {/* Feature buttons */}
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

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Car name input */}
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

        {/* SAVE button */}
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
          SAVE
        </button>

        {/* CANCEL button */}
        <button
          onClick={() => navigate(`/customcars/${id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#333";
            e.currentTarget.style.border = "1px solid white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.border = "1px solid #555";
          }}
          style={{
            background: "transparent",
            color: "#aaa",
            border: "1px solid #555",
            padding: "14px 30px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
            letterSpacing: 2,
            transition: "background 0.2s",
          }}
        >
          CANCEL
        </button>
      </div>

      {/* Option picker popup — giống hệt CreateCar */}
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
                    setSelected((p) => ({ ...p, [activeFeature]: opt }));
                    setError("");
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

      {/* Error message */}
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

      {/* Price + UPDATE + DELETE — góc dưới trái */}
      <div
        style={{
          position: "fixed",
          bottom: 40,
          left: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 100,
        }}
      >
        <div
          style={{
            background: "#8b0000",
            color: "white",
            padding: "14px 32px",
            fontSize: 24,
            fontWeight: "bold",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          💰 ${price.toLocaleString()}
        </div>
        <button
          onClick={handleSubmit}
          style={{
            background: "#8b0000",
            color: "white",
            border: "none",
            padding: "14px 28px",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            letterSpacing: 2,
            borderRadius: 4,
          }}
        >
          UPDATE
        </button>
        <button
          onClick={handleDelete}
          style={{
            background: "#8b0000",
            color: "white",
            border: "none",
            padding: "14px 28px",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            letterSpacing: 2,
            borderRadius: 4,
          }}
        >
          DELETE
        </button>
      </div>
    </div>
  );
};

export default EditCar;
