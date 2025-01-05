import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [recipes, setRecipes] = useState([]);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRecipes();
    fetchReports();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:1240/api/admin/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:1240/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:1240/api/admin/recipe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Recipe deleted successfully.");
      fetchRecipes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setMessage("Failed to delete recipe.");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {message && <div className="admin-message">{message}</div>}

      <section>
        <h2>All Recipes</h2>
        <table>
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>Cuisine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.recipe_name}</td>
                <td>{recipe.cuisine}</td>
                <td>
                  <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Reported Issues</h2>
        <ul>
          {reports.map((report, index) => (
            <li key={index}>
              <p><strong>Recipe:</strong> {report.recipe_name}</p>
              <p><strong>Message:</strong> {report.reports.message}</p>
              <p><strong>Date:</strong> {new Date(report.reports.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPanel;
