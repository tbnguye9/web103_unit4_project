const BASE_PRICE = 50000;

export const calculatePrice = (selected, isConvertible = false) => {
  const total = Object.values(selected).reduce((sum, opt) => {
    return sum + (opt?.price ? Number(opt.price) : 0);
  }, BASE_PRICE);
  return total + (isConvertible ? 10000 : 0);
};
