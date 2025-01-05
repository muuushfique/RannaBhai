import React, { useState } from 'react';
import '../css/BMI.css';

const BMI = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [unitConversions, setUnitConversions] = useState({
    kgToPound: '',
    poundToKg: '',
    cmToInch: '',
    inchToCm: ''
  });

  const calculateBMI = (e) => {
    e.preventDefault();
    let heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
    let weightInKg = weightUnit === 'kg' ? weight : weight * 0.453592;
    
    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    setBMI(calculatedBMI);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return ['Underweight', 'underweight'];
    if (bmi < 25) return ['Normal weight', 'normal'];
    if (bmi < 30) return ['Overweight', 'overweight'];
    return ['Obese', 'obese'];
  };

  const handleConversion = (value, type) => {
    const conversions = {
      kgToPound: value * 2.20462,
      poundToKg: value * 0.453592,
      cmToInch: value * 0.393701,
      inchToCm: value * 2.54
    };

    setUnitConversions(prev => ({
      ...prev,
      [type]: value ? conversions[type].toFixed(2) : ''
    }));
  };

  return (
    <div className="container">
      <h1 className="title">BMI Calculator</h1>
      
      <div className="calculator-section">
        <h2 className="section-title">Calculate Your BMI</h2>
        <form onSubmit={calculateBMI}>
          <div className="form-group">
            <label>Height:</label>
            <div>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height"
              />
              <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)}>
                <option value="cm">cm</option>
                <option value="inch">inches</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Weight:</label>
            <div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
              />
              <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                <option value="kg">kg</option>
                <option value="pound">pounds</option>
              </select>
            </div>
          </div>

          <button type="submit">Calculate BMI</button>
        </form>

        {bmi && (
          <div className="result">
            <div>Your BMI: {bmi.toFixed(1)}</div>
            <div className={`bmi-status ${getBMIStatus(bmi)[1]}`}>
              Status: {getBMIStatus(bmi)[0]}
            </div>
          </div>
        )}
      </div>

      <div className="conversion-grid">
        <div className="calculator-section">
          <h2 className="section-title">Weight Conversion</h2>
          <div className="form-group">
            <label>Kilograms to Pounds:</label>
            <input
              type="number"
              placeholder="Enter kg"
              onChange={(e) => handleConversion(e.target.value, 'kgToPound')}
            />
            {unitConversions.kgToPound && <div>= {unitConversions.kgToPound} lbs</div>}
          </div>

          <div className="form-group">
            <label>Pounds to Kilograms:</label>
            <input
              type="number"
              placeholder="Enter lbs"
              onChange={(e) => handleConversion(e.target.value, 'poundToKg')}
            />
            {unitConversions.poundToKg && <div>= {unitConversions.poundToKg} kg</div>}
          </div>
        </div>

        <div className="calculator-section">
          <h2 className="section-title">Height Conversion</h2>
          <div className="form-group">
            <label>Centimeters to Inches:</label>
            <input
              type="number"
              placeholder="Enter cm"
              onChange={(e) => handleConversion(e.target.value, 'cmToInch')}
            />
            {unitConversions.cmToInch && <div>= {unitConversions.cmToInch} inches</div>}
          </div>

          <div className="form-group">
            <label>Inches to Centimeters:</label>
            <input
              type="number"
              placeholder="Enter inches"
              onChange={(e) => handleConversion(e.target.value, 'inchToCm')}
            />
            {unitConversions.inchToCm && <div>= {unitConversions.inchToCm} cm</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMI;