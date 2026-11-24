# RannaBhai — Culinary Companion, Meal Planner & Nutrition Studio (`v2.0.0`)

[![Live Production](https://img.shields.io/badge/Live-rannabhai.vercel.app-d95d39?style=flat-square&logo=vercel)](https://rannabhai.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4.21-1a1412?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-2f6f4e?style=flat-square&logo=mongodb)](https://www.mongodb.com)

**RannaBhai** (*"Cooking Brother"*) is a full-stack MERN culinary platform designed to make everyday cooking, meal planning, nutrition tracking, and local grocery shopping effortless.

Built with a cohesive **Warm Saffron & Hearth** editorial design system (with both **Warm Parchment Light** and **Midnight Espresso Dark** modes), interactive cooking controls, persistent grocery & cookbook drawers, and a unified 6-tab **Admin Studio**.

---

## Core Features

### 1. Recipe Discovery & Interactive Kitchen Controls
- **Recipe Catalog (`/recipe`):** Live keyword search, regional cuisine tabs (Bengali, Indian, Italian, Thai, Mexican, Greek, Chinese, American, Russian), Vegetarian/Non-Veg filters, popularity & calorie sorting, Grid vs. Compact List layout switcher, and **My Saved Cookbook** bookmark filter.
- **Interactive Recipe Studio (`/RecipeDetails/:id`):**
  - **Dynamic Serving Multiplier (`- / + Servings`):** Automatically scales ingredient quantities and calories in real time.
  - **Step-by-Step Cook Mode:** Focused single-step cooking view with progress tracking.
  - **Built-in Kitchen Timer:** Interactive countdown timer (`5m`, `10m`, `15m`, `30m` presets) with Web Audio completion chime.
  - **One-Click PDF Recipe Cards:** Client-side printable recipe card generator powered by `jsPDF`.
  - **Community Tasting Reviews:** Star ratings, average score badges, and live review threads.
- **Daily Spotlight & Leaderboard (`/recipe-of-the-day`, `/trending-recipe`):** Automated daily chef spotlight and community upvote leaderboard.
- **Pantry Ingredient Matcher & Random Roulette (`/spoonacular`, `/random-recipe`):** Enter comma-separated ingredients in your fridge to match recipes via backend proxy with automatic local MongoDB fallback.

### 2. Persistent Global Grocery Cart & Smart Meal Planner
- **Slide-Over Grocery Cart Drawer:** Accessible from any page via the top utility bar — add ingredients from any recipe, add custom items, check off purchased groceries, or copy to clipboard.
- **Daily & 7-Day Weekly Meal Planner (`/meal-planning`):** Generate calorie-targeted daily menus (Breakfast, Lunch, Dinner) or a full Monday–Sunday weekly schedule, with automatic grocery list extraction and one-click push to the Grocery Cart.

### 3. Nutrition Lab, Wellness & Local Market Finder
- **Ingredients & Meal Nutrition Calculator (`/ingredients`, `/ingredient/:id`):** Browse 37+ ingredients with macro breakdowns (Calories, Protein, Carbs, Fats, Fiber, Calcium, Minerals), see matching recipes, and calculate multi-serving basket macro totals.
- **BMI & Calorie Guide (`/bmi`):** Validated metric (`kg/cm`) and imperial (`lbs/in`) BMI calculator with healthy weight ranges and daily calorie targets.
- **Food Trivia Challenge (`/trivia`):** Interactive culinary & nutrition quiz with score, streak counter, and chef explanations.
- **Grocery Stores Near Me (`/near-me`):** Live `React-Leaflet` OpenStreetMap store locator with browser Geolocation, Haversine distance sorting, and radius slider.
- **Health Practices & Cooking Glossary (`/healthrecommendations`, `/glossary`, `/faq`):** Searchable 59+ condition-focused dietary practices and culinary dictionary.

### 4. Standard 6-Tab Admin Studio (`/admin-panel`)
- **Overview & Analytics:** Live KPI cards (Recipes, Community Likes, Open Reports, Meals/FAQs) and visual popularity bar charts.
- **Recipes Manager:** Searchable catalog with full **Edit Recipe Modal**, New Recipe publisher, and deletion.
- **Moderation Queue:** Inspect flagged recipe reports and **Resolve & Dismiss** reports in one click.
- **FAQs & Planner Meals CRUD:** Create, **Inline Edit**, and delete FAQs and Meal Planner dishes.
- **Contact Inbox & User Roles:** Review/delete contact submissions and manage registered user Admin permissions.

---

## Tech Stack

- **Frontend:** React 19, React Router 7, Lucide Icons, React-Leaflet, jsPDF, Custom CSS Design System (`theme.css`)
- **Backend:** Node.js, Express, Mongoose (MongoDB Atlas), JWT + `bcryptjs` Authentication
- **Deployment:** Full-stack Vercel deployment (`vercel.json` routing React SPA + `/api/*` Express Serverless Function)

---

## Project Structure

```text
RannaBhai/
├── api/
│   └── index.js                # Vercel Serverless Function entry wrapping Express
├── backend/
│   ├── controllers/            # FAQ & Meal CRUD controllers
│   ├── models/                 # Mongoose schemas (User, Recipe, Ingredient, Meal, Store, etc.)
│   ├── routes/                 # REST API endpoints & Spoonacular fallback proxy
│   └── index.js                # Express app & cached MongoDB connection
├── frontend/
│   ├── public/                 # Static assets & Google Fonts (Fraunces + Plus Jakarta Sans)
│   └── src/
│       ├── components/         # Nav, TopBar, Homepage, Home, RecipeDetails, AdminPanel, etc.
│       ├── context/            # AuthContext & KitchenContext (Theme, Bookmarks, Cart, Toasts)
│       ├── services/           # Axios client, procedure/nutrition parsers & jsPDF exporter
│       └── styles/             # Unified Light/Dark Saffron & Hearth theme
└── vercel.json                 # Full-stack Vercel build & routing configuration
```

---

## Local Development

```bash
# 1. Install backend & frontend dependencies
cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps

# 2. Configure backend/.env
# DB_URI=mongodb+srv://...
# JWT_SECRET=your_jwt_secret
# SPOONACULAR_API_KEY=your_optional_key

# 3. Start full-stack development (Express on :1240 + React on :3000)
cd .. && npm run dev
```

---

## Live Deployment

- **Production App & API:** [https://rannabhai.vercel.app](https://rannabhai.vercel.app)
- **Author:** [S. M. Mushfiqur Rahman Nayeem (`@muuushfique`)](https://muuushfique.vercel.app)
