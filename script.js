// script.js

document.addEventListener('DOMContentLoaded', () => {
  const incomeList = document.getElementById('income-list');
  const expenseList = document.getElementById('expense-list');
  const savingsList = document.getElementById('savings-list');

  const totalIncomeEl = document.getElementById('total-income');
  const totalExpensesEl = document.getElementById('total-expenses');
  const totalSavingsEl = document.getElementById('total-savings');
  const availableBalanceEl = document.getElementById('available-balance');

  const BASE_URL = 'http://localhost:3000'; // Base URL for JSON Server

  // Function to fetch and update totals and lists from the server
  const updateTotals = async () => {
    const [incomeData, expenseData, savingsData] = await Promise.all([
      fetch(`${BASE_URL}/income`).then(res => res.json()),
      fetch(`${BASE_URL}/expenses`).then(res => res.json()),
      fetch(`${BASE_URL}/savings`).then(res => res.json())
    ]);

    const totalIncome = incomeData.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
    const totalSavings = savingsData.reduce((sum, s) => sum + s.amount, 0);
    const availableBalance = totalIncome - totalExpenses - totalSavings;

    totalIncomeEl.textContent = totalIncome;
    totalExpensesEl.textContent = totalExpenses;
    totalSavingsEl.textContent = totalSavings;
    availableBalanceEl.textContent = availableBalance;

    renderList(incomeData, incomeList, 'income', i => `${i.source}: KES ${i.amount}`);
    renderList(expenseData, expenseList, 'expenses', e => `${e.category}: KES ${e.amount}`);
    renderList(savingsData, savingsList, 'savings', s => {
      const monthlyTarget = s.duration ? (s.targetAmount / s.duration).toFixed(2) : 'N/A';
      return `${s.goal}: Saved KES ${s.amount} / Target KES ${s.targetAmount || 'N/A'} in ${s.duration || 'N/A'} months (KES ${monthlyTarget}/mo)`;
    }, true);
  };

  // Render list with edit, delete, and optional lock buttons
  const renderList = (items, container, type, formatter, isLockable = false) => {
    container.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = formatter(item);

      // Lock button for savings
      if (isLockable) {
        const lockBtn = document.createElement('button');
        lockBtn.textContent = item.isLocked ? '🔒 Locked' : '🔓 Lock';
        lockBtn.style.marginLeft = '10px';
        lockBtn.style.backgroundColor = '#6c757d';
        lockBtn.style.color = 'white';
        lockBtn.style.border = 'none';
        lockBtn.style.padding = '4px 8px';
        lockBtn.style.borderRadius = '4px';
        lockBtn.style.cursor = 'pointer';

        lockBtn.addEventListener('click', () => {
          const updatedItem = { ...item, isLocked: !item.isLocked };
          fetch(`${BASE_URL}/${type}/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
          }).then(() => updateTotals());
        });

        li.appendChild(lockBtn);
        if (item.isLocked) {
          li.style.opacity = '0.6';
        }
      }

      // Create edit button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.style.marginLeft = '10px';
      editBtn.style.backgroundColor = '#ffc107';
      editBtn.style.color = 'black';
      editBtn.style.border = 'none';
      editBtn.style.padding = '4px 8px';
      editBtn.style.borderRadius = '4px';
      editBtn.style.cursor = 'pointer';

      editBtn.addEventListener('click', () => {
        if (item.isLocked) return alert('This entry is locked and cannot be edited.');
        const newValue = prompt('Enter new amount:');
        const newAmount = parseFloat(newValue);
        if (!isNaN(newAmount)) {
          const updatedItem = { ...item, amount: newAmount };
          fetch(`${BASE_URL}/${type}/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
          }).then(() => updateTotals());
        }
      });

      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.marginLeft = '10px';
      deleteBtn.style.backgroundColor = '#dc3545';
      deleteBtn.style.color = 'white';
      deleteBtn.style.border = 'none';
      deleteBtn.style.padding = '4px 8px';
      deleteBtn.style.borderRadius = '4px';
      deleteBtn.style.cursor = 'pointer';

      deleteBtn.addEventListener('click', () => {
        if (item.isLocked) return alert('This entry is locked and cannot be deleted.');
        fetch(`${BASE_URL}/${type}/${item.id}`, {
          method: 'DELETE'
        }).then(() => updateTotals());
      });

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      container.appendChild(li);
    });
  };

  // Handle Add Income button click
  document.getElementById('add-income').addEventListener('click', () => {
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    if (source && !isNaN(amount)) {
      fetch(`${BASE_URL}/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, amount })
      })
      .then(() => updateTotals());
    }
  });

  // Handle Add Expense button click
  document.getElementById('add-expense').addEventListener('click', () => {
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    if (category && !isNaN(amount)) {
      fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount })
      })
      .then(() => updateTotals());
    }
  });

  // Handle Add Savings button click
  document.getElementById('add-savings').addEventListener('click', () => {
    const goal = document.getElementById('savings-goal').value;
    const amount = parseFloat(document.getElementById('savings-amount').value);
    const targetAmount = parseFloat(document.getElementById('savings-target').value);
    const duration = parseInt(document.getElementById('savings-duration').value);

    if (goal && !isNaN(amount) && !isNaN(targetAmount) && !isNaN(duration)) {
      fetch(`${BASE_URL}/savings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, amount, targetAmount, duration, isLocked: false })
      })
      .then(() => updateTotals());
    }
  });

  updateTotals();
});