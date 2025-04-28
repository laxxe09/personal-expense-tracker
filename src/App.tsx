import React, { useState, useEffect } from 'react';
import { Expense } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryPieChart from './components/CategoryPieChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import './App.css';

const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return MONTH_OPTIONS[today.getMonth()];
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('expenses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setExpenses(parsed);
      }
    } catch (err) {
      console.error('Error loading expenses:', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const resetAll = () => {
    localStorage.removeItem('expenses');
    setExpenses([]);
  };

  const exportCSV = () => {
    const csvHeader = 'Description,Amount,Category,Date\n';
    const rows = expensesForMonth.map(e =>
      `"${e.description}",${e.amount},"${e.category}",${e.date}`
    );
    const csv = csvHeader + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses-${selectedMonth}.csv`);
    link.click();
  };

  const expensesForMonth = expenses.filter(exp => {
    const expenseMonth = new Date(exp.date).toLocaleString('default', { month: 'long' });
    return expenseMonth === selectedMonth;
  });

  const totalThisMonth = expensesForMonth.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals: Record<string, number> = {};
  expensesForMonth.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  return (
    <div className="app">
      <h1>Monthly Expense Tracker</h1>

      <ExpenseForm onAdd={addExpense} />

      <div style={{ marginBottom: '20px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>
          <strong>Month:</strong>{' '}
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {MONTH_OPTIONS.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <button onClick={resetAll}>Reset All</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      <CategoryPieChart expenses={expensesForMonth} />

      <div className="monthly-summary">
        <h2>Monthly Summary: {selectedMonth}</h2>
        <p><strong>Total Spent:</strong> ${totalThisMonth.toFixed(2)}</p>
        <ul>
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <li key={cat}>
              <strong>{cat}:</strong> ${amt.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-container">
        <h2>Monthly Totals Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={MONTH_OPTIONS.map(month => ({
            month,
            total: expenses
              .filter(exp => new Date(exp.date).toLocaleString('default', { month: 'long' }) === month)
              .reduce((sum, exp) => sum + exp.amount, 0)
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
  dataKey="month" 
  type="category" 
  interval={0} 
/>

            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#DA6B5C" name="Total ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ExpenseList expenses={expensesForMonth} onDelete={deleteExpense} />
    </div>
  );
};

export default App;
