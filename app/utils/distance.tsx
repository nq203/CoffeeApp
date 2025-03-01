const toRadians = (degree: number) => (degree * Math.PI) / 180;

export const getDistanceFromUser = (
  userLat: number,
  userLon: number,
  shopLat: number,
  shopLon: number
): number => {
  const R = 6371; // Bán kính trái đất (km)

  const dLat = toRadians(shopLat - userLat);
  const dLon = toRadians(shopLon - userLon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(userLat)) *
      Math.cos(toRadians(shopLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Khoảng cách (km)
};