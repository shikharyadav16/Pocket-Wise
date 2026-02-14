import React, { useState } from 'react';
import { getLocalDateString } from '../utils/formatUtils';

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    customCategory: '',
    note: '',
    date: getLocalDateString()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) return;
    
    // Determine final category
    let finalCategory = formData.category;
    if (formData.category === 'Other') {
        if (!formData.customCategory.trim()) return; // Required check
        finalCategory = formData.customCategory.trim();
    }

    const amountValue = parseFloat(formData.amount);
    if (amountValue <= 0) return; // Prevent negative/zero

    onAddExpense({
      ...formData,
      category: finalCategory,
      amount: amountValue,
      id: Date.now().toString(),
      isNew: true
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'Food',
      customCategory: '',
      note: '',
      date: getLocalDateString()
    });
  };

  return (
    <div className="card">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <div className="input-with-prefix">
            <span className="prefix">₹</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              required
              className="amount-input"
            />
          </div>
          <p className="helper-text">Enter amount in ₹</p>
        </div>
        
        <div className="form-row">
            <div className="form-group half-width">
            <label htmlFor="category">Category</label>
            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
            >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
            </select>
            </div>

            <div className="form-group half-width">
            <label htmlFor="date">Date</label>
            <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
            </div>
        </div>

        {/* Dynamic Custom Category Input */}
        {formData.category === 'Other' && (
            <div className="form-group slide-down-enter">
                <label htmlFor="customCategory">Specify Category</label>
                <input
                    type="text"
                    id="customCategory"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    placeholder="e.g. Rent, Gift, Internet"
                    required
                    autoFocus
                    maxLength={20}
                />
            </div>
        )}

        <div className="form-group">
          <label htmlFor="note">Note</label>
          <input
            type="text"
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Description (optional)"
            maxLength={30}
            autoComplete="off"
          />
        </div>

        <button type="submit" className="btn-primary">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
