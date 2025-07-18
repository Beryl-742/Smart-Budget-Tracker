// script.js
// ==== State ====
let totalIncome = 0;
let totalExpenses = 0;
let savingsList = [];

// DOM elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const totalSavingsEl = document.getElementById('total-savings');
const availableBalanceEl = document.getElementById('available-balance');

const incomeListEl = document.getElementById('income-list');
const expenseListEl = document.getElementById('expense-list');
const savingsListEl = document.getElementById('savings-list');

// === Event Listeners ===

// Add Income
document.getElementById("add-income").addEventListener("click", () => {
  const source = document.getElementById("income-source").value;
  const amount = parseFloat(document.getElementById("income-amount").value);

  if (source && !isNaN(amount) && amount > 0) {
    addIncome(amount, source);
    document.getElementById("income-source").value = "";
    document.getElementById("income-amount").value = "";
  }
});

// Add Expense
document.getElementById("add-expense").addEventListener("click", () => {
  const category = document.getElementById("expense-category").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);

  if (category && !isNaN(amount) && amount > 0) {
    addExpense(amount, category);
    document.getElementById("expense-category").value = "";
    document.getElementById("expense-amount").value = "";
  }
});

// Add Savings
document.getElementById("add-savings").addEventListener("click", () => {
  const title = document.getElementById("savings-goal").value;
  const amount = parseFloat(document.getElementById("savings-amount").value);
  const target = parseFloat(document.getElementById("savings-target").value);
  const duration = document.getElementById("savings-duration").value;

  if (title && !isNaN(amount) && amount > 0 && !isNaN(target) && target > 0 && duration) {
    addSavings(title, amount, target, duration);
    document.getElementById("savings-goal").value = "";
    document.getElementById("savings-amount").value = "";
    document.getElementById("savings-target").value = "";
    document.getElementById("savings-duration").value = "";
  }
});

// === Logic Functions ===

function addIncome(amount, description) {
  totalIncome += amount;
  updateTotals();
  renderIncomeEntry({ amount, description });
}

function addExpense(amount, description) {
  totalExpenses += amount;
  updateTotals();
  renderExpenseEntry({ amount, description });
}

function addSavings(title, amount, target, duration) {
  const savings = { title, amount, target, duration };
  savingsList.push(savings);
  updateTotals();
  renderSavingsItem(savings);
}

function updateTotals() {
  const totalSavings = savingsList.reduce((sum, item) => sum + item.amount, 0);
  const availableBalance = totalIncome - totalExpenses - totalSavings;

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpensesEl.textContent = totalExpenses.toFixed(2);
  totalSavingsEl.textContent = totalSavings.toFixed(2);
  availableBalanceEl.textContent = availableBalance.toFixed(2);

  // Alerts
  if (totalExpenses > totalIncome) {
    totalExpensesEl.style.color = 'red';
  } else {
    totalExpensesEl.style.color = '';
  }

  savingsList.forEach((savings, index) => {
    const progress = (savings.amount / savings.target) * 100;
    const li = savingsListEl.children[index];
    if (li) {
      const bar = li.querySelector('.progress-bar');
      const status = li.querySelector('.status');
      bar.style.backgroundColor = progress >= 100 ? 'green' : '#28a745';
      status.style.color = progress >= 100 ? 'green' : 'black';
    }
  });
}

// === Render Functions ===

function renderIncomeEntry(entry) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>KES ${entry.amount.toFixed(2)}</td>
    <td>${entry.description}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    totalIncome -= entry.amount;
    updateTotals();
    row.remove();
  });

  incomeListEl.appendChild(row);
}

function renderExpenseEntry(entry) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>KES ${entry.amount.toFixed(2)}</td>
    <td>${entry.description}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    totalExpenses -= entry.amount;
    updateTotals();
    row.remove();
  });

  expenseListEl.appendChild(row);
}

function renderSavingsItem(savings) {
  const li = document.createElement('li');

  const percentage = Math.min((savings.amount / savings.target) * 100, 100).toFixed(1);

  li.innerHTML = `
    <strong>${savings.title}</strong><br>
    <span>Ksh ${savings.amount.toFixed(2)} saved of Ksh ${savings.target.toFixed(2)}</span><br>
    <span>Duration: ${savings.duration} months</span>
    <div class="progress-bar-container" style="background: #eee; height: 20px; width: 100%; margin-top: 5px;">
      <div class="progress-bar" style="height: 100%; width: ${percentage}%; background-color: ${percentage == 100 ? 'green' : '#28a745'};"></div>
    </div>
    <div class="status">${percentage}% ${percentage == 100 ? '🎉 Goal reached!' : 'in progress'}</div>
  `;

  savingsListEl.appendChild(li);
}