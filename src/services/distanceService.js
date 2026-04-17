class DistanceService {
  // Calculate distance between two points
  static calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate fare based on distance
  static calculateFare(distance) {
    const baseFare = 50;
    const perUnitFare = 10;
    return Math.round(baseFare + (distance * perUnitFare));
  }

  // Find nearest driver from a list
  static findNearestDriver(pickupX, pickupY, drivers) {
    if (!drivers || drivers.length === 0) {
      return null;
    }

    let nearestDriver = null;
    let minDistance = Infinity;

    for (const driver of drivers) {
      const distance = this.calculateDistance(
        pickupX, pickupY,
        driver.current_x, driver.current_y
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = { ...driver, distance };
      }
    }

    return nearestDriver;
  }

  // Calculate estimated time (assuming speed of 20 units per minute)
  static calculateEstimatedTime(distance) {
    const speed = 20;
    return Math.ceil(distance / speed);
  }
}

module.exports = DistanceService;