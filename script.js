let balance = localStorage.getItem('balance') ?
    parseFloat(localStorage.getItem('balance')) :
    10000;

const balanceElement = document.getElementById('balance');
const historyElement = document.getElementById('history');
const messageElement = document.getElementById('message');
const pairElement = document.getElementById('pair');
const priceElement = document.getElementById('price');

const forexPrices = {
  'EUR/USD': 1.17,
  'GBP/USD': 1.35,
  'USD/JPY': 159.47,
  'AUD/USD': 0.72,
  'USD/CAD': 1.38,
};

function updateBalance() {
  balanceElement.innerText = `$${balance.toLocaleString()}`;
  localStorage.setItem('balance', balance);
}

function randomPriceMovement() {
  for (let pair in forexPrices) {
    let movement = (Math.random() - 0.5) * 0.01;
    forexPrices[pair] += movement;
  }

  updateDisplayedPrice();
  drawChart();
}

function updateDisplayedPrice() {
  const pair = pairElement.value;
  priceElement.value = forexPrices[pair].toFixed(4);
}

pairElement.addEventListener('change', updateDisplayedPrice);

function showMessage(message, color) {
  messageElement.innerText = message;
  messageElement.style.color = color;

  setTimeout(() => {
    messageElement.innerText = '';
  }, 3000);
}

function createTrade(type) {
  const pair = pairElement.value;
  const amount = parseFloat(document.getElementById('amount').value);
  const price = parseFloat(priceElement.value);

  if (isNaN(amount) || amount <= 0) {
    showMessage('Enter valid trade amount', 'red');
    return;
  }

  if (amount > balance) {
    showMessage('Insufficient Balance', 'red');
    return;
  }

  balance -= amount;

  const profitLoss = ((Math.random() - 0.4) * amount).toFixed(2);

  balance += parseFloat(amount) + parseFloat(profitLoss);

  updateBalance();

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${type}</td>
    <td>${pair}</td>
    <td>$${amount}</td>
    <td>${price}</td>
    <td class="${profitLoss >= 0 ? 'profit' : 'loss'}">
      ${profitLoss >= 0 ? '+' : ''}$${profitLoss}
    </td>
  `;

  historyElement.prepend(row);

  saveHistory();

  showMessage(`${type} Trade Executed Successfully`, '#22c55e');

  document.getElementById('amount').value = '';
}

function buyTrade() {
  createTrade('BUY');
}

function sellTrade() {
  createTrade('SELL');
}

function saveHistory() {
  localStorage.setItem('tradeHistory', historyElement.innerHTML);
}

function loadHistory() {
  const saved = localStorage.getItem('tradeHistory');

  if (saved) {
    historyElement.innerHTML = saved;
  }
}

const canvas = document.getElementById('chartCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let chartData = [];

function drawChart() {
  if (chartData.length > 50) {
    chartData.shift();
  }

  chartData.push(parseFloat(priceElement.value));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#38bdf8';

  chartData.forEach((price, index) => {
    const x = index * 15;
    const y = 300 - (price * 100);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

updateBalance();
updateDisplayedPrice();
loadHistory();
drawChart();

setInterval(randomPriceMovement, 2000);
