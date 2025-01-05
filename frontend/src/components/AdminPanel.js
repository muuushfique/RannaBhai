import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../css/AdminPanel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('faq');
    const [isOpen, setIsOpen] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [meals, setMeals] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        id: null
    });
    const [mealFormData, setMealFormData] = useState({
        name: '',
        description: '',
        calories: '',
        image: '',
        category: 'Breakfast',
        id: null
    });

    const categories = ['Breakfast', 'Lunch', 'Dinner'];
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchFAQs = async () => {
        try {
            const response = await axios.get('http://localhost:1240/faqs');
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };
    const fetchMeals = async () => {
        try {
            const response = await axios.get('http://localhost:1240/meals');
            setMeals(response.data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    };
    useEffect(() => {
        fetchFAQs();
        fetchMeals();
    }, []);
    const handleMealInputChange = (e) => {
        const { name, value } = e.target;
        setMealFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMealEdit = (meal) => {
        setMealFormData({
            name: meal.name,
            description: meal.description,
            calories: meal.calories,
            image: meal.image,
            category: meal.category,
            id: meal._id
        });
        setIsEditing(true);
        setIsOpen(true);
    };

    const handleMealDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await axios.delete(`http://localhost:1240/delete-meal/${id}`);
                fetchMeals();
            } catch (error) {
                console.error('Error deleting meal:', error);
            }
        }
    };

    const handleMealSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing) {
                await axios.put(`http://localhost:1240/update-meal/${mealFormData.id}`, mealFormData);
            } else {
                await axios.post('http://localhost:1240/add-new-meal', mealFormData);
            }
            fetchMeals();
            setMealFormData({ name: '', description: '', calories: '', image: '', category: 'Breakfast', id: null });
            setIsOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving meal:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (faq) => {
        setFormData({
            question: faq.question,
            answer: faq.answer,
            id: faq._id
        });
        setIsEditing(true);
        setIsOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                console.log('Deleting FAQ with ID:', id);
                await axios.delete(`http://localhost:1240/delete-faq/${id}`);
                fetchFAQs();
            } catch (error) {
                console.error('Error deleting FAQ:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing) {
                await axios.put(`http://localhost:1240/update-faq/${formData.id}`, formData);
            } else {
                await axios.post('http://localhost:1240/add-new-faq', formData);
            }
            fetchFAQs();
            setFormData({ question: '', answer: '', id: null });
            setIsOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving FAQ:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsOpen(false);
        setIsEditing(false);
        setFormData({ question: '', answer: '', id: null });
    };

    return (
        <div className="admin-faq-container">
            <div className="admin-panel-tabs">
                <button 
                    className={`admin-panel-tab ${activeTab === 'faq' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faq')}
                >
                    FAQ Management
                </button>
                <button 
                    className={`admin-panel-tab ${activeTab === 'meal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('meal')}
                >
                    Meal Management
                </button>
            </div>
    
            {activeTab === 'faq' ? (
                <div className="admin-faq-panel">
                    <div className="admin-faq-header">
                        <h2 className="admin-faq-title">FAQ Management</h2>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="admin-faq-add-button"
                        >
                            <Plus className="admin-faq-icon" />
                            Add FAQ
                        </button>
                    </div>
    
                    {faqs.length === 0 ? (
                        <p className="admin-faq-empty">No FAQs added yet</p>
                    ) : (
                        <div className="admin-faq-list">
                            {faqs.map((faq) => (
                                <div key={faq._id} className="admin-faq-item">
                                    <div className="admin-faq-content">
                                        <h3 className="admin-faq-question">{faq.question}</h3>
                                        <p className="admin-faq-answer">{faq.answer}</p>
                                    </div>
                                    <div className="admin-faq-actions">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="admin-faq-edit-button"
                                        >
                                            <Edit className="admin-faq-icon" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq._id)}
                                            className="admin-faq-delete-button"
                                        >
                                            <Trash2 className="admin-faq-icon" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="admin-faq-panel">
                    <div className="admin-faq-header">
                        <h2 className="admin-faq-title">Meal Management</h2>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="admin-faq-add-button"
                        >
                            <Plus className="admin-faq-icon" />
                            Add Meal
                        </button>
                    </div>
    
                    {meals.length === 0 ? (
                        <p className="admin-faq-empty">No meals added yet</p>
                    ) : (
                        <div className="admin-faq-list">
                            {meals.map((meal) => (
                                <div key={meal._id} className="admin-faq-item admin-meal-item">
                                    <img src={meal.image} alt={meal.name} className="admin-meal-image" />
                                    <div className="admin-meal-details">
                                        <h3 className="admin-faq-question">{meal.name}</h3>
                                        <p className="admin-faq-answer">{meal.description}</p>
                                        <span className="admin-meal-category">{meal.category}</span>
                                        <span>Calories: {meal.calories}</span>
                                    </div>
                                    <div className="admin-faq-actions">
                                        <button
                                            onClick={() => handleMealEdit(meal)}
                                            className="admin-faq-edit-button"
                                        >
                                            <Edit className="admin-faq-icon" />
                                        </button>
                                        <button
                                            onClick={() => handleMealDelete(meal._id)}
                                            className="admin-faq-delete-button"
                                        >
                                            <Trash2 className="admin-faq-icon" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
    
            {isOpen && activeTab === 'faq' && (
                <div className="admin-faq-modal-overlay">
                    <div className="admin-faq-modal">
                        <div className="admin-faq-modal-header">
                            <h3 className="admin-faq-modal-title">
                                {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
                            </h3>
                            <button onClick={handleModalClose} className="admin-faq-close-button">×</button>
                        </div>
    
                        <form onSubmit={handleSubmit} className="admin-faq-form">
                            <div className="admin-faq-form-group">
                                <label>Question</label>
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    placeholder="Enter FAQ question"
                                    required
                                />
                            </div>
                            <div className="admin-faq-form-group">
                                <label>Answer</label>
                                <textarea
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleInputChange}
                                    placeholder="Enter FAQ answer"
                                    required
                                    rows={4}
                                />
                            </div>
                            <div className="admin-faq-form-actions">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="admin-faq-cancel-button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="admin-faq-submit-button"
                                >
                                    {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add FAQ')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    
            {isOpen && activeTab === 'meal' && (
                <div className="admin-faq-modal-overlay">
                    <div className="admin-faq-modal">
                        <div className="admin-faq-modal-header">
                            <h3 className="admin-faq-modal-title">
                                {isEditing ? 'Edit Meal' : 'Add New Meal'}
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="admin-faq-close-button">×</button>
                        </div>
    
                        <form onSubmit={handleMealSubmit} className="admin-faq-form">
                            <div className="admin-faq-form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={mealFormData.name}
                                    onChange={handleMealInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-faq-form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={mealFormData.description}
                                    onChange={handleMealInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-faq-form-group">
                                <label>Calories</label>
                                <input
                                    type="number"
                                    name="calories"
                                    value={mealFormData.calories}
                                    onChange={handleMealInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-faq-form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={mealFormData.image}
                                    onChange={handleMealInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-faq-form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={mealFormData.category}
                                    onChange={handleMealInputChange}
                                    required
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-faq-form-actions">
                                <button type="button" onClick={() => setIsOpen(false)} className="admin-faq-cancel-button">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="admin-faq-submit-button">
                                    {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Meal')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default AdminPanel;