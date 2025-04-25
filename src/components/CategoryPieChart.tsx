import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Expense } from '../types';

const CATEGORY_COLORS: { [key: string]: string } = {
  Grocery: '#8884d8',
  'Dining out': '#82ca9d',
  Transportation: '#ffc658',
  Bills: '#ff8042',
  Shopping: '#a4de6c',
  General: '#d0ed57',
};

interface Props {
  expenses: Expense[];
}

const CategoryPieChart: React.FC<Props> = ({ expenses }) => {
  const dataMap: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    if (!dataMap[expense.category]) {
      dataMap[expense.category] = 0;
    }
    dataMap[expense.category] += expense.amount;
  });

  const data = Object.entries(dataMap).map(([category, value]) => ({
    name: category,
    value,
  }));

  return (
    <div style={{ height: 320, marginBottom: 40 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Spending by Category
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              label
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || '#cccccc'}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: 'center', color: '#888' }}>No data available</p>
      )}
    </div>
  );
};

export default CategoryPieChart;
