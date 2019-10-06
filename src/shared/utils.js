// If the name longer than the truncateLength,
// truncate the name to the truncateLength and
// append ellipsis to it.
function truncateName(name, truncateLength) {
  if (name.length <= truncateLength) { return name; }
  else { return (name.slice(0, truncateLength) + '...'); }
}

// Replace spaces with non-breaking spaces.
function nonBreakingSpaces(str) {
  return str.replace(/ /g, "&nbsp;");
}

class Point {
  // The distance between two points
  static distance(p1, p2) {
    const dx = (p1.x - p2.x);
    const dy = (p1.y - p2.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  static length(p) {
    return Point.distance(p, {x: 0, y: 0});
  }

  static subtract(p1, p2) {
    return {x: (p1.x - p2.x), y: (p1.y - p2.y)};
  }

  static add(p1, p2) {
    return {x: (p1.x + p2.x), y: (p1.y + p2.y)};
  }

  // p: point, c: constant
  static scale(p, c) {
    return {x: (c * p.x), y: (c * p.y)};
  }

  // east is 0, north is 0.5*PI, etc.(counterclockwise, unit: rad)
  static directionAngleX(p) {
    // First quadrant(and positive x, y axes, origin)
    if (p.x >= 0 && p.y >= 0) {
      return Math.atan2(p.y, p.x);
    }
    // Second quadrant
    if (p.x < 0 && p.y > 0) {
      return (Math.PI - Math.atan2(p.y, -p.x));
    }
    // Third quadrant(and negative x, y axes)
    if (p.x <= 0 && p.y <= 0) {
      return (Math.PI + Math.atan2(-p.y, -p.x));
    }
    // Forth quadrant
    if (p.x > 0 && p.y < 0) {
      return (1.5 * Math.PI + Math.atan2(-p.y, p.x));
    }
    return 0;
  }

  // azimuthal angle
  // north is 0, east is 0.5*PI, etc.(clockwise, unit: rad)
  static direction(p) {
    const angleX = Point.directionAngleX(p);
    const inverseAngleX = (2 * Math.PI - angleX) % (2 * Math.PI);
    return (inverseAngleX + 0.5 * Math.PI) % (2 * Math.PI);
  }

  // convert the azimuthal angle into a vector(point) with length one
  static directionToPoint(dir) {
    const inverseDir = (2 * Math.PI - dir) % (2 * Math.PI);
    const angleX = (inverseDir + 0.5 * Math.PI) % (2 * Math.PI);
    return {x: Math.cos(angleX), y: Math.sin(angleX)};
  }

  static unitVector(p) {
    const length = Point.length(p);
    return Point.scale(p, 1 / length);
  }
}


module.exports = {
  truncateName,
  nonBreakingSpaces,
  Point,
}
