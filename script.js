// script.js
// ==== State ====
let totalIncome = 0;
let totalExpenses = 0;
let savingsList = [];

const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const totalSavingsEl = document.getElementById("total-savings");
const availableBalanceEl = document.getElementById("available-balance");

const incomeListEl = document.getElementById("income-list");
const expenseListEl = document.getElementById("expense-list");
const savingsListEl = document.getElementById("savings-list");

// DOM elements for forms
const incomeSourceInput = document.getElementById("income-source");
const incomeAmountInput = document.getElementById("income-amount");
const incomeDateInput = document.getElementById("income-date");

const expenseCategoryInput = document.getElementById("expense-category");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseDateInput = document.getElementById("expense-date");

const savingsGoalInput = document.getElementById("savings-goal");
const savingsAmountInput = document.getElementById("savings-amount");
const savingsTargetInput = document.getElementById("savings-target");
const savingsDurationInput = document.getElementById("savings-duration");

// Add income
document.getElementById("add-income").addEventListener("click", () => {
  const source = incomeSourceInput.value;
  const amount = parseFloat(incomeAmountInput.value);
  const date = incomeDateInput.value;

  if (source && !isNaN(amount) && amount > 0 && date) {
    addIncome(amount, source, date);
    incomeSourceInput.value = "";
    incomeAmountInput.value = "";
    incomeDateInput.value = "";
  }
});

function addIncome(amount, description, date) {
  totalIncome += amount;
  updateTotals();
  renderIncomeEntry({ amount, description, date });
}

function renderIncomeEntry(entry) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>KES ${entry.amount.toFixed(2)}</td>
    <td>${entry.description}</td>
    <td>${entry.date}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  row.querySelector(".delete-btn").addEventListener("click", () => {
    totalIncome -= entry.amount;
    updateTotals();
    row.remove();
  });
  incomeListEl.appendChild(row);
}

// Add expense
document.getElementById("add-expense").addEventListener("click", () => {
  const category = expenseCategoryInput.value;
  const amount = parseFloat(expenseAmountInput.value);
  const date = expenseDateInput.value;

  if (category && !isNaN(amount) && amount > 0 && date) {
    addExpense(amount, category, date);
    expenseCategoryInput.value = "";
    expenseAmountInput.value = "";
    expenseDateInput.value = "";
  }
});

function addExpense(amount, description, date) {
  totalExpenses += amount;
  updateTotals();
  renderExpenseEntry({ amount, description, date });
}

function renderExpenseEntry(entry) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>KES ${entry.amount.toFixed(2)}</td>
    <td>${entry.description}</td>
    <td>${entry.date}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  row.querySelector(".delete-btn").addEventListener("click", () => {
    totalExpenses -= entry.amount;
    updateTotals();
    row.remove();
  });
  expenseListEl.appendChild(row);
}

// Add savings
document.getElementById("add-savings").addEventListener("click", () => {
  const title = savingsGoalInput.value;
  const amount = parseFloat(savingsAmountInput.value);
  const target = parseFloat(savingsTargetInput.value);
  const duration = savingsDurationInput.value;

  if (title && !isNaN(amount) && !isNaN(target) && duration) {
    addSavings(title, amount, target, duration);
    savingsGoalInput.value = "";
    savingsAmountInput.value = "";
    savingsTargetInput.value = "";
    savingsDurationInput.value = "";
  }
});

function addSavings(title, amount, target, duration) {
  const savings = { title, amount, target, duration };
  savingsList.push(savings);
  updateTotals();
  renderSavingsItem(savings);
}

function renderSavingsItem(savings) {
  const li = document.createElement("li");
  const percentage = Math.min((savings.amount / savings.target) * 100, 100).toFixed(1);

  li.innerHTML = `
    <strong>${savings.title}</strong>
    <span> - KES ${savings.amount} saved of KES ${savings.target}</span>
    <span> - Duration: ${savings.duration} months</span>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentage}%; background-color: ${percentage == 100 ? 'green' : 'blue'};"></div>
    </div>
    <div>${percentage}% ${percentage == 100 ? '🎉 Goal reached!' : 'in progress'}</div>
  `;

  savingsListEl.appendChild(li);
}

// Totals
function updateTotals() {
  const totalSavings = savingsList.reduce((sum, s) => sum + s.amount, 0);
  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpensesEl.textContent = totalExpenses.toFixed(2);
  totalSavingsEl.textContent = totalSavings.toFixed(2);
  availableBalanceEl.textContent = (totalIncome - totalExpenses - totalSavings).toFixed(2);
}