onmessage = function(e){
  const [data, TOTAL_TICKS, totalTicksRemaining] = e.data;
  let countdown = totalTicksRemaining;
  
  data.map(d => {
    let output;
    const currTicks = d.data.ticks;
    if (currTicks < TOTAL_TICKS){
      for (let i = currTicks; i < TOTAL_TICKS; i++){
        output = tick(d.data, TOTAL_TICKS);
        postMessage(countdown--);
      }
    }
    else {
      output = d.data;
    }
    return output;
  });

  postMessage(data);
}

// Can't require in web workers, so all the functions are here
function lineLength(line){
  return Math.sqrt(Math.pow(line[1][0] - line[0][0], 2) + Math.pow(line[1][1] - line[0][1], 2));
}

function pointTranslate(point, angle, distance){
  const r = angleToRadians(angle);
  return [point[0] + distance * Math.cos(r), point[1] + distance * Math.sin(r)];
}

function angleToRadians(angle){
  return angle / 180 * Math.PI;
}

function lineAngle(line){
  return angleToDegrees(Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]));
}

function angleReflect(incidenceAngle, surfaceAngle){
  const a = surfaceAngle * 2 - incidenceAngle;
  return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
}

function angleToDegrees(angle){
  return angle * 180 / Math.PI;
}

function pointLeftOfLine(point, line){
  const t = topPointFirst(line);
  return cross(point, t[1], t[0]) < 0;
}

function topPointFirst(line){
  return line[1][1] > line[0][1] ? line : [line[1], line[0]];
}

function cross (a, b, o){
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function lineMidpoint(line){
  return [(line[0][0] + line[1][0]) / 2, (line[0][1] + line[1][1]) / 2];
}

function lineInterpolate(line){
  return t => t === 0 ? line[0] : t === 1 ? line[1] : pointTranslate(line[0], lineAngle(line), lineLength(line) * t);
}

function closestPoint(point, line) {
  var length = lineLength(line),
      interpolator = lineInterpolate(line),
      precision = 8,
      best,
      bestLength,
      bestDistance = Infinity;

  // linear scan for coarse approximation
  for (var scan, scanLength = 0, scanDistance; scanLength <= length; scanLength += precision) {
    const pct = scanLength / length;
    if ((scanDistance = distance2(scan = interpolator(pct))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
    
    const pctBefore = beforeLength / length, pctAfter = afterLength / length;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = interpolator(pctBefore))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= length && (afterDistance = distance2(after = interpolator(pctAfter) )) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }
  
  return best;

  function distance2(p) {
    var dx = p[0] - point[0],
        dy = p[1] - point[1];
    return dx * dx + dy * dy;
  }
}

function tick(simulation, TOTAL_TICKS){
  simulation.ticks++;

  // Update the walls
  if (simulation.updateWalls){
    const gap = gapScale(simulation.ticks, TOTAL_TICKS, simulation.height);
    simulation.walls = makeGap(simulation, gap);
  }

  // See who's cured
  simulation.data.forEach(d => {
    if (d.infected){
      if (simulation.ticksToRecover < simulation.ticks - d.timeAtInfection){
        d.infected = false;
        d.recovered = true;
        d.timeAtInfection = null;
      }
    }
  });

  const sick = simulation.data.filter(f => f.infected).length;
  const recovered = simulation.data.filter(f => f.recovered).length;
  const noChange = sick === simulation.lastSick && recovered === simulation.lastRecovered;

  // If there has been no change in the number of sick,
  // simply update the previous tick
  if (noChange && simulation.storage.length){
    simulation.storage[simulation.storage.length - 1].tick++;
  }
  // Otherwise add a new datum
  else {
    simulation.storage.push({tick: simulation.ticks, sick, recovered, well: simulation.data.length - sick - recovered});  
  }

  // Loop through the data
  for (let i = 0; i < simulation.data.length; i++){
    const d = simulation.data[i];
    d.collided = false;

    // Detect collisions
    for (let i0 = 0; i0 < simulation.data.length; i0++){
      const d0 = simulation.data[i0];
      d0.collided = false;

      // Collision!
      if (i !== i0 && lineLength([d.pos, d0.pos]) < d.radius + d0.radius && !d.collided && !d0.collided){

        // Test if moving them in each other's angles will bring them closer or farther apart
        const keep0 = pointTranslate(d.pos, d.angle, d.speed),
              keep1 = pointTranslate(d0.pos, d0.angle, d0.speed),
              keep = lineLength([keep0, keep1]),
              change0 = pointTranslate(d.pos, d0.angle, d0.speed),
              change1 = pointTranslate(d0.pos, d.angle, d.speed),
              change = lineLength([change0, change1]);

        if (keep < change) {
          const dc = JSON.parse(JSON.stringify(d));

          if (simulation.transferEnergy){
            d.angle = d0.angle;
            d0.angle = dc.angle;
            d.speed = d0.speed;
            d0.speed = dc.speed;            
          }

          else {
            if (d.speed && d0.speed){
              d.angle = d0.angle;
              d0.angle = dc.angle;
            }
            else {
              d.angle = angleReflect(d.angle, -d.angle);
              d0.angle = angleReflect(d0.angle, -d0.angle);  
            }
            
          }

          // Whether to infect each other
          if (d.infected && !d0.infected && !d0.recovered) {
            d0.infected = true;
            d0.timeAtInfection = simulation.ticks;
          }

          if (d0.infected && !d.infected && !d.recovered) {
            d.infected = true;
            d.timeAtInfection = simulation.ticks;
          }

          d.collided = true;
          d0.collided = true;
        }
        
        break;
      }
    }

    // Detect custom walls
    for (let i0 = 0; i0 < simulation.walls.length; i0++){
      const wall = simulation.walls[i0],
            projPoint = pointTranslate(d.pos, lineAngle([d.pos, closestPoint(d.pos, wall)]), d.radius),
            pointLeft = pointLeftOfLine(d.pos, wall),
            projLeft = pointLeftOfLine(projPoint, wall);

      // Flip it
      if (pointLeft !== projLeft) {

        // Need some logic so that it doesn't get stuck on the wall
        const newAngle = angleReflect(d.angle, lineAngle(wall)),
              newPos = pointTranslate(d.pos, newAngle, d.speed),
              midpoint = lineMidpoint(wall);

        // If the nowPos is closer to the wall's midpoint, don't change the angle
        // if (lineLength([newPos, midpoint]) < lineLength([d.pos, midpoint])){
        d.angle = newAngle;
        // }
      }

    }

    // Detect outer walls
    if (d.pos[0] <= d.radius || d.pos[0] >= simulation.width - d.radius){

      // Is it moving more towards the middle or not
      const t0 = pointTranslate(d.pos, d.angle, d.speed);
      const l0 = lineLength([simulation.center, t0]);

      const reflected = angleReflect(d.angle, 90);
      const t1 = pointTranslate(d.pos, reflected, d.speed);
      const l1 = lineLength([simulation.center, t1]);

      if (l1 < l0) d.angle = reflected;
    }

    // Detect vertical walls
    if (d.pos[1] <= d.radius || d.pos[1] >= simulation.height - d.radius){
      // Is it moving more towards the middle or not
      const t0 = pointTranslate(d.pos, d.angle, d.speed);
      const l0 = lineLength([simulation.center, t0]);

      const reflected = angleReflect(d.angle, 0);
      const t1 = pointTranslate(d.pos, reflected, d.speed);
      const l1 = lineLength([simulation.center, t1]);

      if (l1 < l0) d.angle = reflected;
    }

    d.pos = pointTranslate(d.pos, d.angle, d.speed);
  }

  return simulation;
}

// Have to write my own scale linear
function gapScale(ticks, TOTAL_TICKS, height){
  const domainDistance = TOTAL_TICKS / 2 - TOTAL_TICKS / 6;
  const domainPosition = (ticks - TOTAL_TICKS / 6) / domainDistance;

  const rangeDistance = height / 4;
  const output = rangeDistance * domainPosition;

  return output < 0 ? 0 : output > rangeDistance ? rangeDistance : output;
}

function makeGap(simulation, gap){
  return [
    [
      [simulation.width * .3 - 10, 0],
      [simulation.width * .3 - 10, simulation.height * .5 - gap]
    ],
    [
      [simulation.width * .3 + 10, 0],
      [simulation.width * .3 + 10, simulation.height * .5 - gap]
    ],
    [
      [simulation.width * .3 - 10, simulation.height * .5 - gap],
      [simulation.width * .3 + 10, simulation.height * .5 - gap]
    ],
    [
      [simulation.width * .3 - 10, simulation.height],
      [simulation.width * .3 - 10, simulation.height * .5 + gap]
    ],
    [
      [simulation.width * .3 + 10, simulation.height],
      [simulation.width * .3 + 10, simulation.height * .5 + gap]
    ],
    [
      [simulation.width * .3 - 10, simulation.height * .5 + gap],
      [simulation.width * .3 + 10, simulation.height * .5 + gap]
    ]
  ];
}
