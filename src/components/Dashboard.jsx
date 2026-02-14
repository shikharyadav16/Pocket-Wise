import React from 'react';
import { getLocalDateString, formatCurrency } from '../utils/formatUtils';

function Dashboard({ expenses }) {
  const today = getLocalDateString();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalToday = expenses
    .filter(expense => expense.date === today)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalMonth = expenses
    .filter(expense => {
      const [year, month] = expense.date.split('-').map(Number);
      return (
        month - 1 === currentMonth &&
        year === currentYear
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

   // Calculate category totals for this month
  const categoryTotals = expenses
    .filter(expense => {
      const [year, month] = expense.date.split('-').map(Number);
      return month - 1 === currentMonth && year === currentYear;
    })
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

  return (
    <>
      <div className="stat-card summary-hero">
        <div className="main-stat">
          <span className="stat-label">Total This Month</span>
          <h2 className="stat-value">{formatCurrency(totalMonth)}</h2>
        </div>
        <div className="stat-divider"></div>
        <div className="secondary-stat-row">
          <div className="sub-stat">
            <span className="stat-label-sm">Today</span>
            <span className="stat-value-sm">{formatCurrency(totalToday)}</span>
          </div>
        </div>
      </div>

      {/* Category Chips - only show if there is spending this month */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="category-scroll-container">
          {categories.map(cat => {
            const amount = categoryTotals[cat] || 0;
            if (amount === 0) return null;
            return (
              <div key={cat} className="category-chip">
                <span className={`chip-dot dot-${cat.toLowerCase()}`}></span>
                <span className="chip-label">{cat}</span>
                <span className="chip-value">{formatCurrency(amount)}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Dashboard;
