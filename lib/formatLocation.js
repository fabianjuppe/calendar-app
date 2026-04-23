export function formatLocation(location) {
  if (!location) return "";
  const { street, houseNumber, zip, city } = location;
  return [
    street && houseNumber ? `${street} ${houseNumber}` : street,
    zip && city ? `${zip} ${city}` : city,
  ]
    .filter(Boolean)
    .join(", ");
}
