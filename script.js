// script.js

document.addEventListener('DOMContentLoaded', () => {
  const incomeList = document.getElementById('income-list');
  const expenseList = document.getElementById('expense-list');
  const savingsList = document.getElementById('savings-list');

  const totalIncomeEl = document.getElementById('total-income');
  const totalExpensesEl = document.getElementById('total-expenses');
  const totalSavingsEl = document.getElementById('total-savings');
  const availableBalanceEl = document.getElementById('available-balance');

  let incomes = [];
  let expenses = [];
  let savings = [];

  const updateTotals = () => {
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
    const availableBalance = totalIncome - totalExpenses - totalSavings;

    totalIncomeEl.textContent = totalIncome;
    totalExpensesEl.textContent = totalExpenses;
    totalSavingsEl.textContent = totalSavings;
    availableBalanceEl.textContent = availableBalance;
  };

  const renderList = (items, container, formatter) => {
    container.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = formatter(item);
      container.appendChild(li);
    });
  };

  document.getElementById('add-income').addEventListener('click', () => {
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    if (source && !isNaN(amount)) {
      incomes.push({ source, amount });
      renderList(incomes, incomeList, i => `${i.source}: KES ${i.amount}`);
      updateTotals();
    }
  });

  document.getElementById('add-expense').addEventListener('click', () => {
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    if (category && !isNaN(amount)) {
      expenses.push({ category, amount });
      renderList(expenses, expenseList, e => `${e.category}: KES ${e.amount}`);
      updateTotals();
    }
  });

  document.getElementById('add-savings').addEventListener('click', () => {
    const goal = document.getElementById('savings-goal').value;
    const amount = parseFloat(document.getElementById('savings-amount').value);
    if (goal && !isNaN(amount)) {
      savings.push({ goal, amount });
      renderList(savings, savingsList, s => `${s.goal}: KES ${s.amount}`);
      updateTotals();
    }
  });
});