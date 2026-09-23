// Mock data generator for 207 METR-LA traffic sensors
// Realistic freeway names and locations in Los Angeles highway system

const FREEWAYS = [
  { name: 'I-110 N (Harbor Fwy)', count: 35, baseSpeed: 62.5 },
  { name: 'I-110 S (Harbor Fwy)', count: 35, baseSpeed: 61.0 },
  { name: 'I-5 N (Santa Ana Fwy)', count: 30, baseSpeed: 64.0 },
  { name: 'I-5 S (Santa Ana Fwy)', count: 30, baseSpeed: 63.5 },
  { name: 'US-101 S (Hollywood Fwy)', count: 25, baseSpeed: 58.0 },
  { name: 'I-405 N (San Diego Fwy)', count: 26, baseSpeed: 60.5 },
  { name: 'I-10 E (Santa Monica Fwy)', count: 26, baseSpeed: 59.0 },
];

export function generateSensorMetadata() {
  const sensors = [];
  let index = 0;
  
  FREEWAYS.forEach((fw) => {
    for (let i = 0; i < fw.count; i++) {
      if (index >= 207) break;
      const milepost = (10 + i * 0.8).toFixed(1);
      sensors.push({
        id: index,
        name: `Sensor #${index}`,
        location: `${fw.name} @ MP ${milepost}`,
        freeway: fw.name,
        referenceSpeed: parseFloat((fw.baseSpeed + (index % 5) - 2).toFixed(1)),
      });
      index++;
    }
  });

  return sensors;
}

export const SENSOR_METADATA = generateSensorMetadata();

// Generate initial mock prediction response (207 sensors)
export function generateMockPredictionResponse(scenario = 'rush_hour') {
  const timestamp = new Date().toISOString();
  
  const sensors = SENSOR_METADATA.map((s, idx) => {
    let speedMult = 0.95;
    let mainClass = 'LOW';
    let severeProb = 0.05;
    let modProb = 0.25;
    let lowProb = 0.70;

    // Simulate different congestion patterns based on scenario
    if (scenario === 'rush_hour') {
      if (idx % 4 === 0 || idx % 7 === 0) {
        // Severe bottleneck sensors
        speedMult = 0.35 + (idx % 3) * 0.05;
        mainClass = 'SEVERE';
        severeProb = 0.82;
        modProb = 0.15;
        lowProb = 0.03;
      } else if (idx % 2 === 0) {
        // Moderate delay
        speedMult = 0.65;
        mainClass = 'MODERATE';
        severeProb = 0.12;
        modProb = 0.75;
        lowProb = 0.13;
      }
    } else if (scenario === 'bottleneck') {
      if (idx >= 40 && idx <= 85) {
        // Major corridor failure
        speedMult = 0.22 + (idx % 4) * 0.04;
        mainClass = 'SEVERE';
        severeProb = 0.92;
        modProb = 0.07;
        lowProb = 0.01;
      } else if (idx >= 30 && idx <= 95) {
        speedMult = 0.58;
        mainClass = 'MODERATE';
        severeProb = 0.20;
        modProb = 0.70;
        lowProb = 0.10;
      }
    } else if (scenario === 'free_flow') {
      speedMult = 0.98 + (idx % 3) * 0.01;
      mainClass = 'LOW';
      severeProb = 0.01;
      modProb = 0.04;
      lowProb = 0.95;
    }

    const predictedSpeed = Math.max(8.0, parseFloat((s.referenceSpeed * speedMult).toFixed(1)));
    const congestionIndex = parseFloat(Math.max(0, Math.min(1, 1 - predictedSpeed / s.referenceSpeed)).toFixed(3));

    // Top SHAP feature contributions customized per sensor condition
    const topFeatures = [
      { feature: 'gru_predicted_speed', contribution: mainClass === 'SEVERE' ? -0.421 : 0.385 },
      { feature: 'high_speed_fraction', contribution: mainClass === 'SEVERE' ? -0.284 : 0.210 },
      { feature: 'rolling_speed_mean_15m', contribution: mainClass === 'SEVERE' ? -0.192 : 0.145 },
      { feature: 'speed_std_30m', contribution: 0.088 },
      { feature: 'hour_sin', contribution: -0.042 },
    ];

    return {
      sensor_index: idx,
      predicted_speed: predictedSpeed,
      congestion_index: congestionIndex,
      congestion_class: mainClass,
      probabilities: {
        LOW: lowProb,
        MODERATE: modProb,
        SEVERE: severeProb,
      },
      explanation: {
        predicted_class: mainClass,
        predicted_class_id: mainClass === 'LOW' ? 0 : mainClass === 'MODERATE' ? 1 : 2,
        top_features: topFeatures,
      },
    };
  });

  return {
    timestamp,
    forecast_horizon: 'next 5 minutes',
    sensors,
  };
}

// Preset historical speed sequence generator (12 timesteps x 207 sensors)
export function generateMockSequence(scenario = 'rush_hour') {
  const sequence = [];
  for (let t = 0; t < 12; t++) {
    const timestepSpeeds = [];
    const trend = t < 6 ? -1 * t * 0.5 : (t - 6) * 0.3; // Slight temporal curve
    for (let s = 0; s < 207; s++) {
      const ref = SENSOR_METADATA[s].referenceSpeed;
      let factor = 0.9;
      if (scenario === 'rush_hour' && (s % 4 === 0 || s % 7 === 0)) factor = 0.4;
      if (scenario === 'bottleneck' && s >= 40 && s <= 85) factor = 0.25;
      if (scenario === 'free_flow') factor = 0.98;

      const speed = Math.max(5.0, ref * factor + trend + (Math.sin(s + t) * 2));
      timestepSpeeds.push(parseFloat(speed.toFixed(2)));
    }
    sequence.push(timestepSpeeds);
  }
  return sequence;
}
