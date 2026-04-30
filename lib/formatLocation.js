export function formatLocation(location) {
  if (!location) return null;
  const { street, houseNumber, zip, city } = location;
  const result = [
    street && houseNumber ? `${street} ${houseNumber}` : street,
    zip && city ? `${zip} ${city}` : city,
  ]
    .filter(Boolean)
    .join(", ");
  return result || null;
}
