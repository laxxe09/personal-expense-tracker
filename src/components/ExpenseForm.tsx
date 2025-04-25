import React, { useState, useRef, useEffect } from 'react';
import { Expense } from '../types';

interface Props {
  onAdd: (expense: Expense) => void;
}

const CATEGORY_OPTIONS = [
  'Grocery',
  'Dining out',
  'Transportation',
  'Bills',
  'Shopping',
  'General',
];

const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const descRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    descRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;

    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date,
    };

    onAdd(newExpense);

    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    descRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="form-table">
      <div className="form-row">
        <input
          ref={descRef}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
