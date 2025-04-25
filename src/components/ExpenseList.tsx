import React from 'react';
import { Expense } from '../types';

interface Props {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

const ExpenseList: React.FC<Props> = ({ expenses, onDelete }) => {
  return (
    <div>
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul>
          {expenses.map(exp => (
            <li key={exp.id}>
              {exp.description} — ${exp.amount.toFixed(2)} on {exp.date}
              <button onClick={() => onDelete(exp.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
