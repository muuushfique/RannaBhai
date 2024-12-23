import React, { useState, useEffect } from 'react';
import { createDietPlan, getDietPlans } from '../utils/handle';

const DietPlan = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ name: '', meals: [] });

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getDietPlans();
      setPlans(data);
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDietPlan(newPlan);
    setNewPlan({ name: '', meals: [] });
    const data = await getDietPlans();
    setPlans(data);
  };

  return (
    <div>
      <h2>Diet Plans</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newPlan.name}
          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          placeholder="Enter plan name"
        />
        <button type="submit">Save Plan</button>
      </form>
      <ul>
        {plans.map((plan) => (
          <li key={plan._id}>{plan.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DietPlan;
