export const getAllOptions = () => fetch("/api/options").then((r) => r.json());
