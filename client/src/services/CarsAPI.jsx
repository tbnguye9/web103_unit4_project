const BASE = "/api/cars";

export const getAllCars = () => fetch(BASE).then((r) => r.json());
export const getCarById = (id) => fetch(`${BASE}/${id}`).then((r) => r.json());

export const createCar = (car) =>
  fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  }).then((r) => r.json());

export const updateCar = (id, car) =>
  fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  }).then((r) => r.json());

export const deleteCar = (id) =>
  fetch(`${BASE}/${id}`, {
    method: "DELETE",
  }).then((r) => r.json());
