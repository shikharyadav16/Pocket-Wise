import React, { useMemo, useState } from 'react';
import { formatCurrency, getRelativeDateLabel } from '../utils/formatUtils';

function ExpenseList({ expenses, onDeleteExpense }) {
  if (expenses.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
        <h3 className="empty-title">No expenses found</h3>
        <p className="empty-subtitle">Track your spending by adding an expense above.</p>
      </div>
    );
  }

  // Group expenses by date
  const groupedExpenses = useMemo(() => {
    // First sort all expenses by date desc
    const sorted = [...expenses].sort((a, b) => {
        // Simple string comparison works for ISO 'YYYY-MM-DD' formats
        return b.date.localeCompare(a.date) || b.id.localeCompare(a.id); 
    });

    const groups = {};
    sorted.forEach(expense => {
      if (!groups[expense.date]) {
        groups[expense.date] = [];
      }
      groups[expense.date].push(expense);
    });

    return groups;
  }, [expenses]);

  // Sort dates descending
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  return (
    <div className="card-no-padding"> 
      <h2 className="list-title">History</h2>
      <div className="expense-list-container">
        {sortedDates.map(date => (
          <div key={date} className="date-group">
            <h3 className="date-header">{getRelativeDateLabel(date)}</h3>
            <div className="date-group-items">
              {groupedExpenses[date].map(expense => (
                <div key={expense.id} className={`expense-item ${expense.isNew ? 'item-new' : ''}`}>
                  <div className="expense-icon-wrapper">
                    <CategoryIcon category={expense.category} />
                  </div>
                  <div className="expense-info">
                    <div className="expense-main-row">
                      <span className="expense-category">{expense.category}</span>
                      <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                    </div>
                    {expense.note && <div className="expense-note">{expense.note}</div>}
                  </div>
                  <div className="expense-actions">
                    <DeleteButton 
                        onConfirm={() => onDeleteExpense(expense.id)} 
                        expenseName={expense.category}
                        amount={expense.amount}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DeleteButton = ({ onConfirm, expenseName, amount }) => {
    const [isConfirming, setIsConfirming] = React.useState(false);

    if (isConfirming) {
        return (
            <div className="delete-confirm-group">
                <button 
                    className="btn-confirm-delete" 
                    onClick={onConfirm}
                    title="Confirm Delete"
                >
                    Confirm
                </button>
                <button 
                    className="btn-cancel-delete" 
                    onClick={() => setIsConfirming(false)}
                    title="Cancel"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button 
            className="btn-delete-icon"
            onClick={() => setIsConfirming(true)}
            aria-label={`Delete ${expenseName} expense`}
            title="Delete"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
        </button>
    );
};

// Simple internal icon component
const CategoryIcon = ({ category }) => {
  const getIcon = (cat) => {
    switch(cat) {
      case 'Food': return '🍔';
      case 'Travel': return '✈️';
      case 'Bills': return '💡';
      case 'Shopping': return '🛍️';
      default: return '📝';
    }
  };
  return <span className="category-icon" role="img" aria-label={category}>{getIcon(category)}</span>;
};

export default ExpenseList;
