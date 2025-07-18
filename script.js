// script.js
// ==== State ====
let totalIncome = 0;
let totalExpenses = 0;
let savingsList = [];

const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const savingsForm = document.getElementById('savings-form');

const incomeInput = document.getElementById('income-input');
const expenseInput = document.getElementById('expense-input');
const savingsTitleInput = document.getElementById('savings-title-input');
const savingsAmountInput = document.getElementById('savings-amount-input');
const savingsTargetInput = document.getElementById('savings-target-input');
const savingsDurationInput = document.getElementById('savings-duration-input');

const incomeList = document.getElementById('income-list');
const expenseList = document.getElementById('expense-list');
const savingsListEl = document.getElementById('savings-list');

const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const totalSavingsEl = document.getElementById('total-savings');

// ==== Event Listeners ====
document.getElementById("add-income").addEventListener("click", () => {
  const source = document.getElementById("income-source").value;
  const amount = parseFloat(document.getElementById("income-amount").value);

  if (source && !isNaN(amount) && amount > 0) {
    addIncome(amount, source);
    document.getElementById("income-source").value = "";
    document.getElementById("income-amount").value = "";
  }
});

document.getElementById("add-expense").addEventListener("click", () => {
  const category = document.getElementById("expense-category").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);

  if (category && !isNaN(amount) && amount > 0) {
    addExpense(amount, category);
    document.getElementById("expense-category").value = "";
    document.getElementById("expense-amount").value = "";
  }
});

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

savingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = savingsTitleInput.value;
  const amount = parseFloat(savingsAmountInput.value);
  const target = parseFloat(savingsTargetInput.value);
  const duration = savingsDurationInput.value;

  if (title && !isNaN(amount) && amount > 0 && !isNaN(target) && target > 0 && duration) {
    addSavings(title, amount, target, duration);
    savingsTitleInput.value = '';
    savingsAmountInput.value = '';
    savingsTargetInput.value = '';
    savingsDurationInput.value = '';
  }
});

// ==== Functions ====

function addIncome(amount) {
  totalIncome += amount;
  updateTotals();
  renderIncome(amount);
}

function addExpense(amount) {
  totalExpenses += amount;
  updateTotals();
  renderExpense(amount);
}

function addSavings(title, amount, target, duration) {
  const savings = {
    title,
    amount,
    target,
    duration
  };
  savingsList.push(savings);
  updateTotals();
  renderSavingsItem(savings);
}

function updateTotals() {
  const totalSavings = savingsList.reduce((sum, item) => sum + item.amount, 0);
  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpensesEl.textContent = totalExpenses.toFixed(2);
  totalSavingsEl.textContent = totalSavings.toFixed(2);
}

// Function to render income entry in table
function renderIncomeEntry(income) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>KES ${income.amount}</td>
    <td>${income.description}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    incomeList = incomeList.filter((item) => item !== income);
    updateTotals();
    row.remove();
  });

  document.getElementById("income-list").appendChild(row);
}

// Function to render expense entry in table
function renderExpenseEntry(expense) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>KES ${expense.amount}</td>
    <td>${expense.description}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    expenseList = expenseList.filter((item) => item !== expense);
    updateTotals();
    row.remove();
  });

  document.getElementById("expense-list").appendChild(row);
}

function renderSavingsItem(savings) {
  const li = document.createElement('li');

  const percentage = Math.min((savings.amount / savings.target) * 100, 100).toFixed(1);

  li.innerHTML = `
    <strong>${savings.title}</strong>
    <span>Ksh ${savings.amount.toFixed(2)} saved of Ksh ${savings.target.toFixed(2)}</span>
    <span>Duration: ${savings.duration}</span>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentage}%; background-color: ${percentage == 100 ? '#00c851' : '#28a745'};"></div>
    </div>
    <div class="status">${percentage}% ${percentage == 100 ? '🎉 Goal reached!' : 'in progress'}</div>
  `;

  savingsListEl.appendChild(li);
}