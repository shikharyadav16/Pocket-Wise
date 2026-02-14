import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import './App.css'; 

function App() {
  // Initialize expenses from localStorage with safe parsing
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('pocketwise_expenses');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error loading expenses from localStorage:', err);
      return [];
    }
  });

  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pocketwise_theme') || 'light';
  });

  // Apply theme to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pocketwise_theme', theme);
  }, [theme]);

  // Sync expenses with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pocketwise_expenses', JSON.stringify(expenses));
    } catch (err) {
      console.error('Error saving expenses to localStorage:', err);
    }
  }, [expenses]);

  const addExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      isNew: true
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const [filter, setFilter] = useState('month');

  const filteredExpenses = React.useMemo(() => {
    if (filter === 'all') return expenses;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Better local date handling
    const getLocalYMD = (d) => {
        return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
    };
    const localToday = getLocalYMD(new Date());

    return expenses.filter(expense => {
        if (filter === 'today') {
            return expense.date === localToday;
        }
        if (filter === 'month') {
            const [year, month] = expense.date.split('-').map(Number);
            return month - 1 === currentMonth && year === currentYear;
        }
        return true;
    });
  }, [expenses, filter]);

  return (
    <div className="app-container">
      <header>
        <h1>PocketWise</h1>
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            // Moon icon for dark mode
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            // Sun icon for light mode
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </header>
      
      <main>
        <Dashboard expenses={expenses} />
        
        <ExpenseForm onAddExpense={addExpense} />
        
        {/* Filter Bar */}
        <div className="filter-bar">
            {['today', 'month', 'all'].map(option => (
                <button
                    key={option}
                    className={`filter-pill ${filter === option ? 'active' : ''}`}
                    onClick={() => setFilter(option)}
                >
                    {option === 'month' ? 'This Month' : option === 'all' ? 'All Time' : 'Today'}
                </button>
            ))}
        </div>

        <ExpenseList expenses={filteredExpenses} onDeleteExpense={deleteExpense} />
      </main>
    </div>
  );
}

export default App;
