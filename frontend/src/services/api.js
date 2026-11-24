import axios from 'axios';
import jsPDF from 'jspdf';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:1240');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getRecipeFallbackImage(seed = 'food') {
  const palette = ['d95d39', '2f6f4e', 'd99b26', '572b1c'];
  const hash = String(seed)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const bg = palette[hash % palette.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="#${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#faf6f0" font-family="Georgia,serif" font-size="30" font-weight="700">RannaBhai Kitchen</text></svg>`
  )}`;
}

export function stripHtml(html = '') {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseProcedure(proc) {
  if (!proc) return { steps: [], attribution: null };
  if (Array.isArray(proc)) {
    return { steps: proc.filter(Boolean), attribution: null };
  }
  if (typeof proc === 'string') {
    const steps = proc.split(/(?<=\.)\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    return { steps, attribution: null };
  }
  if (typeof proc === 'object') {
    const raw = proc.instructions || proc.steps || '';
    const steps = Array.isArray(raw)
      ? raw.filter(Boolean)
      : String(raw).split(/(?<=\.)\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    const attribution = proc.from || proc.by ? `${proc.from || ''}${proc.from && proc.by ? ' — ' : ''}${proc.by || ''}` : null;
    return { steps, attribution };
  }
  return { steps: [], attribution: null };
}

export function normalizeNutrition(n = {}) {
  return {
    calories: Number(n.calories ?? 0),
    protein: Number(n.protein ?? n.protein_g ?? 0),
    carbs: Number(n.carbohydrates ?? n.carbs_g ?? 0),
    fat: Number(n.fats ?? n.fat_g ?? 0),
    fiber: Number(n.fiber ?? n.fiber_g ?? 0),
    calcium: Number(n.calcium ?? 0),
    minerals: Number(n.minerals ?? 0),
  };
}

export function exportRecipeToPDF(recipe) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const title = recipe.recipe_name || recipe.title || 'RannaBhai Recipe';
  const margin = 44;
  let y = 56;

  doc.setFillColor(26, 20, 18);
  doc.rect(0, 0, 595, 92, 'F');
  doc.setTextColor(250, 246, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(title, margin, 52);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('RannaBhai Kitchen · Printable Recipe Card', margin, 72);

  y = 122;
  doc.setTextColor(28, 22, 19);
  doc.setFontSize(11);
  const meta = [
    recipe.cuisine ? `Cuisine: ${recipe.cuisine}` : null,
    recipe.diet_type ? `Diet: ${recipe.diet_type}` : null,
    recipe.calories ? `Calories: ${recipe.calories} kcal` : null,
    recipe.no_of_servings ? `Servings: ${recipe.no_of_servings}` : null,
  ]
    .filter(Boolean)
    .join('   •   ');
  if (meta) {
    doc.text(meta, margin, y);
    y += 26;
  }

  const ingredients = recipe.ingredient_list || (recipe.extendedIngredients || []).map((i) => i.original);
  if (ingredients.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(217, 93, 57);
    doc.text('Ingredients', margin, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(28, 22, 19);
    ingredients.forEach((item) => {
      const lines = doc.splitTextToSize(`•  ${item}`, 505);
      if (y > 770) {
        doc.addPage();
        y = 50;
      }
      doc.text(lines, margin, y);
      y += lines.length * 16;
    });
    y += 14;
  }

  const parsedProc = parseProcedure(recipe.recipe_procedure);
  const steps = parsedProc.steps.length
    ? parsedProc.steps
    : stripHtml(recipe.instructions || '')
        .split(/(?<=\.)\s+/)
        .filter(Boolean);

  if (steps.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(217, 93, 57);
    if (y > 740) {
      doc.addPage();
      y = 50;
    }
    doc.text('Preparation Steps', margin, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(28, 22, 19);
    steps.forEach((step, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}.  ${step}`, 505);
      if (y > 760) {
        doc.addPage();
        y = 50;
      }
      doc.text(lines, margin, y);
      y += lines.length * 16 + 6;
    });
  }

  doc.save(`${title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.pdf`);
}

export default api;
