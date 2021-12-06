import { spline } from "@georgedoescode/generative-utils";

// Myster-function that takes a seed and returns a pseudo-random value.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

//Linear interpolation, i.e: Move positions slightly.
function lerp(position, target, amount) {
  return {
    x: (position.x += (target.x - position.x) * amount),
    y: (position.y += (target.y - position.y) * amount),
  };
}

class Blob {
  
  propToString = (prop) => prop.toString().trim();
  propToNumber = (prop) => parseFloat(prop);

  paint(ctx, geometry, properties) {
    
    //Extract the CSS-variables from the element. They work as our own arguments.
    const seed = this.propToNumber(properties.get("--blob-seed"));
    const numPoints = this.propToNumber(properties.get("--blob-num-points"));
    const variance = this.propToNumber(properties.get("--blob-variance"));
    const smoothness = this.propToNumber(properties.get("--blob-smoothness"));
    const fill = this.propToString(properties.get("--blob-fill"));
    const random = mulberry32(seed);

    //Blob starts out as a circle based on it's containing element.
    const radius = Math.min(geometry.width, geometry.height) / 2;
    const center = {
      x: geometry.width / 2,
      y: geometry.height / 2,
    };
    const points = [];
    // Number of points determine how many degrees difference we need between two points.
    const angleStep = (Math.PI * 2) / numPoints;
    
    // Generate the array of points we want to draw
    for (let i = 1; i <= numPoints; i++) {
      const angle = i * angleStep;
      const point = {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      };
      points.push(lerp(point, center, variance * random()));
    }

    ctx.fillStyle = fill;
    ctx.beginPath();

    // Draw a path between the points using a Catmull-Romspline, whatever that is...
    spline(points, smoothness, true, (CMD, data) => {
      if (CMD === "MOVE") {
        ctx.moveTo(...data);
      } else {
        ctx.bezierCurveTo(...data);
      }
    });

    ctx.fill();
  }

  static get inputProperties() {
    return [
      "--blob-seed",
      "--blob-num-points",
      "--blob-variance",
      "--blob-smoothness",
      "--blob-fill",
    ];
  }

}

if (typeof registerPaint !== "undefined") {
  registerPaint("blob", Blob);
}