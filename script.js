document.getElementById("costRange").oninput = function(){
	updateCost();
	updateGraph();
}
		
document.getElementById("lvlRange").oninput = function(){
	updateLvl();
	updateGraph();
}

document.getElementById("copiesText").oninput = function(){
	updateGraph();
}

document.getElementById("poolText").oninput = function(){
	updateGraph();
}

document.getElementById("goldText").oninput = function(){
	updateGraph();
}

function updateCost(){
	var val = document.getElementById("costRange").value
	document.getElementById("costOutput").innerHTML = val
	updateGraph();
}

function updateLvl(){
	var val = document.getElementById("lvlRange").value
	document.getElementById("lvlOutput").innerHTML = val
	updateGraph();
}

var cost = document.getElementById("costRange")
var lvl = document.getElementById("lvlRange")
var copies = document.getElementById("copiesText")
var pool = document.getElementById("poolText")
var gold = document.getElementById("goldText")

// Default graph

var ctx = document.getElementById("myChart")


var chart = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: ['1','2','3','4','5','6','7','8','9'],
						datasets: [{
							label: 'Probability of getting at least x units',
							data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
						}]
					},
					options: {
						scales: {
							y: {
								suggestedMin: 0,
								suggestedMax: 1,
								beginAtZero: true
							}
						},

						plugins: {
							tooltip: {
								displayColors: false,
								bodyFont: {
									size: 20
								},
								callbacks: {

									title: function(tooltipItem) {
										return '';
									},

									label: function (tooltipItem) {
										var tooltipText = '';
							            if (tooltipItem.dataset.data[tooltipItem.dataIndex] != null)
							              tooltipText = tooltipItem.dataset.data[tooltipItem.dataIndex].toString();
							            return tooltipText;
									}
								}
							}

						}
					}
				});

function updateGraph() {
	chart.data.datasets = [{
							label: 'Probability of getting at least x units',
							data: getProbs(
									parseInt(cost.value),
									parseInt(lvl.value),
									parseInt(copies.value),
									parseInt(pool.value),
									parseInt(gold.value))[1].slice(1)
						}]
	chart.update();
}

// CALCULATIONS

const totalUnits = [22, 20, 17, 10, 9];
const distinctChamps = [13, 13, 13, 12, 8];

const costProbs = [		  // level
  [1,    0,    0,    0,    0],    // 1
  [1,    0,    0,    0,    0],    // 2
  [0.75, 0.25, 0,    0,    0],    // 3
  [0.55, 0.30, 0.15, 0,    0],    // 4
  [0.45, 0.33, 0.20, 0.02, 0],    // 5
  [0.30, 0.40, 0.25, 0.05, 0],    // 6
  [0.19, 0.30, 0.40, 0.10, 0.01], // 7
  [0.18, 0.25, 0.32, 0.22, 0.03], // 8
  [0.10, 0.20, 0.25, 0.35, 0.10], // 9
  [0.05, 0.10, 0.20, 0.40, 0.25], // 10
  [0.01, 0.02, 0.12, 0.50, 0.35]  // 11
];

function getCostProb(lvl, cost){ // 1-indexed
  return costProbs[lvl - 1][cost - 1];
}

// Returns cumulative probability of getting 0-9 copies
// cost: Desired unit cost
// lvl: Current level
// a: Number of copies of this unit already out
// b: Number of units of the same cost already out
// gold: Amount of gold you want to roll
function getProbs(cost, lvl, a, b, gold) {
  var mat = getTransitionMatrix(cost, lvl, a, b);
  mat = power(mat, 5*Math.floor(gold/2));

  // Probabilities for exactly 0, 1, 2, ..., 9 of desired unit
  const pprob = mat[0] 

  // Cumulative probabilities for at least 0, 1, 2, ..., 9 of desired unit
  let cprob = [1];
  for (let i = 1; i < 10; i++) {
    let p = 1;
    for (let j = 0; j < i; j++) {
      p -= pprob[j];
    }
    cprob.push(p.toFixed(2));
  }

  return [pprob, cprob];
}

function getTransitionMatrix(cost, lvl, a, b){
  const mat = [];
  for (let i = 0; i < 10; i++) {
    const newRow = [];
    for (let j = 0; j < 10; j++) {
      if (i == 9 && j == 9) {
      	newRow.push(1); // from X >= 9 to X >= 9, probability is 1
      	continue;
      }
      const p = getTransitionProb(cost, lvl, a + i, b + i);
      if (j == i) {
        newRow.push(1 - p);
      } else if (j == i + 1) {
        newRow.push(p);
      } else {
        newRow.push(0);
      }
    }
    mat.push(newRow);
  }
  return mat;
}

// Probability of rolling the desired unit in one shop given this state
function getTransitionProb(cost, lvl, a, b){
  const howManyLeft = Math.max(0, totalUnits[cost - 1] - a);
  const poolSize = totalUnits[cost - 1] * distinctChamps[cost - 1] - b;
  return getCostProb(lvl, cost) * (howManyLeft / poolSize)
}

//Matrix multiplication rounded to 3 d.p.
function multiply(a, b){
  var aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
      m[r][c] = m[r][c]
    }
  }
  return m;
}

function power(a, n){
	var newmat = a
	for (let i = 0; i < n-1; i++) {
		newmat = multiply(newmat, a);
	}
	return newmat;
}
