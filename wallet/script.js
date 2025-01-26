let isSignedUp = false;
let savedGoals = [];
let currentBalance = 0;

function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function handleAddGoal() {
  if (!isSignedUp) {
    navigateTo('signup-page');
  } else {
    navigateTo('details-page');
  }
}

function submitSignup() {
  const formInputs = document.querySelectorAll('#signup-form input');
  const allFieldsFilled = Array.from(formInputs).every(input => input.value.trim() !== '');

  if (allFieldsFilled) {
    isSignedUp = true;
    currentBalance = parseFloat(document.getElementById('bank-balance').value);
    updateBalanceDisplay();
    alert('Sign-up successful!');
    navigateTo('home-page');
  } else {
    alert('Please fill in all the fields.');
  }
}

function saveGoal() {
  const name = document.getElementById('goal-name').value;
  const date = document.getElementById('goal-date').value;
  const amount = parseFloat(document.getElementById('goal-amount').value);

  if (name && date && amount) {
    savedGoals.push({ name, date, amount, deposited: 0 });
    alert('Goal saved successfully!');
    navigateTo('home-page');
  } else {
    alert('Please fill in all fields.');
  }
}

function viewMyGoals() {
  const container = document.getElementById('goals-container');
  container.innerHTML = savedGoals.length
    ? savedGoals
        .map(
          (goal, index) => `
      <p onclick="openGoalActions(${index})">
        <strong>${goal.name}</strong> - ₹${goal.deposited} / ₹${goal.amount} ${
            goal.deposited >= goal.amount ? '(Achieved)' : ''
          }
      </p>`
        )
        .join('')
    : '<p>No goals added yet.</p>';
  navigateTo('my-goals-page');
}

function openGoalActions(index) {
  const goal = savedGoals[index];
  const container = document.getElementById('goal-info');
  container.innerHTML = `
    <p><strong>${goal.name}</strong></p>
    <p>Target: ₹${goal.amount}</p>
    <p>Deposited: ₹${goal.deposited}</p>
  `;

  const actionsContainer = document.getElementById('goal-actions');
  actionsContainer.innerHTML = `
    <button onclick="openDepositPage(${index})">Deposit Money</button>
    ${
      goal.deposited >= goal.amount
        ? `<button onclick="withdrawMoney(${index})">Withdraw Money</button>`
        : ''
    }
  `;

  navigateTo('goal-actions-page');
}

function openDepositPage(index) {
  const goal = savedGoals[index];
  document.getElementById('goal-info').innerText = `${goal.name}: ₹${goal.deposited} / ₹${goal.amount}`;
  document.getElementById('deposit-page').dataset.index = index;
  navigateTo('deposit-page');
}

function depositMoney() {
  const index = parseInt(document.getElementById('deposit-page').dataset.index, 10);
  const amount = parseFloat(document.getElementById('deposit-amount').value);
  const goal = savedGoals[index];

  if (amount > currentBalance) {
    alert("You don't have enough balance.");
  } else if (goal.deposited + amount > goal.amount) {
    alert('Deposit exceeds target amount.');
  } else {
    goal.deposited += amount;
    currentBalance -= amount;
    updateBalanceDisplay();
    alert('Deposit successful!');
    navigateTo('my-goals-page');
  }
}

function withdrawMoney(index) {
  const goal = savedGoals[index];
  const amount = goal.deposited;

  if (goal.deposited >= goal.amount) {
    currentBalance += amount;
    goal.deposited = 0; // Reset deposited amount after withdrawal
    updateBalanceDisplay();
    alert('Withdrawal successful! Current balance updated.');
    navigateTo('my-goals-page');
  } else {
    alert('Withdrawal is only available for completed goals.');
  }
}

function updateBalanceDisplay() {
  document.getElementById('current-balance').innerText = currentBalance.toFixed(2);
}









