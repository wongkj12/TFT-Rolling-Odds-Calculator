document.getElementById("setRange").onchange = function () {
  //   updateSet();
  updateGraph();
};

document.getElementById("costRange").oninput = function () {
  updateCost();
  updateGraph();
};

document.getElementById("lvlRange").oninput = function () {
  updateLvl();
  updateGraph();
};

document.getElementById("copiesText").oninput = function () {
  updateGraph();
};

document.getElementById("poolText").oninput = function () {
  updateGraph();
};

document.getElementById("goldText").oninput = function () {
  updateGraph();
};

document.getElementById("xpToNextLvlText").oninput = function () {
  updateGraph();
};

// function updateSet() {
//   var val = document.getElementById("setRange").value;
//   document.getElementById("setOutput").innerHTML = val;
//   updateGraph();
// }

function updateCost() {
  var val = document.getElementById("costRange").value;
  document.getElementById("costOutput").innerHTML = val;
  updateGraph();
  updateMaxInputValues();
}

function updateLvl() {
  var val = document.getElementById("lvlRange").value;
  document.getElementById("lvlOutput").innerHTML = val;
  updateGraph();
}

function updateGoldToNextLvl() {
  var val = document.getElementById("goldToNextLvlText").value;
  document.getElementById("goldToNextLvlOutput").innerHTML = val;
  updateGraph();
}

function updateXPToNextLvl() {
  var val = document.getElementById("xpToNextLvlText").value;
  document.getElementById("xpToNextLvlOutput").innerHTML = val;
  updateGraph();
}

const unitPool = new Map();

unitPool.set(1, 30);
unitPool.set(2, 25);
unitPool.set(3, 18);
unitPool.set(4, 10);
unitPool.set(5, 9);

function updateMaxInputValues() {
  var val = parseInt(document.getElementById("costOutput").innerHTML);
  var result = 30;
  switch (val) {
    case 1:
      result = unitPool.get(1);
      break;
    case 2:
      result = unitPool.get(2);
      break;
    case 3:
      result = unitPool.get(3);
      break;
    case 4:
      result = unitPool.get(4);
      break;
    case 5:
      result = unitPool.get(5);
      break;
  }
  var element = document.getElementById("copiesText");
  element.max = result;
  if (element.value > result) {
    element.value = result;
  }
}

// Default graph

var ctx = document.getElementById("myChart");

var chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    datasets: [
      {
        label: "Probability of getting at least x units",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  },
  options: {
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 1,
        beginAtZero: true,
        ticks: {
          format: {
            style: "percent",
          },
        },
      },
    },

    plugins: {
      tooltip: {
        displayColors: false,
        bodyFont: {
          size: 20,
        },
        callbacks: {
          title: function (tooltipItem) {
            return "";
          },

          label: function (tooltipItem) {
            var tooltipText = "";
            if (tooltipItem.dataset.data[tooltipItem.dataIndex] != null)
              tooltipText =
                tooltipItem.dataset.data[tooltipItem.dataIndex].toString();
            let percentage = (tooltipText * 100).toFixed(2) + "%";

            return percentage;
          },
        },
      },
    },
  },
});

function updateGraph() {
  var set = document.getElementById("setRange").value;
  var cost = parseInt(document.getElementById("costRange").value);
  var lvl = parseInt(document.getElementById("lvlRange").value);
  var copies = parseInt(document.getElementById("copiesText").value);
  var pool = parseInt(document.getElementById("poolText").value);
  var gold = parseInt(document.getElementById("goldText").value);
  var xpToNextLvl = parseInt(document.getElementById("xpToNextLvlText").value);
  const levelOutputData = getProbs(
    cost,
    lvl,
    copies,
    pool,
    gold,
    set //to change to text for 13b
  )[1].slice(1);
  let xpReq = xpToNextLvl;
  let goldToNextLvl = 4.0 * Math.ceil(xpReq / 4.0);

  if (gold - goldToNextLvl > 0 && goldToNextLvl && lvl < 11) {
    const lvlPlusOneGold = gold - goldToNextLvl;
    lvlPlusOneLvl = lvl + 1;
    chart.data.datasets = [
      {
        label: "Probability of getting at least x units - lvl " + lvl,
        data: levelOutputData,
      },
      {
        label: "Probability of getting at least x units - lvl " + lvlPlusOneLvl,
        data: getProbs(
          cost,
          lvlPlusOneLvl,
          copies,
          pool,
          lvlPlusOneGold,
          set //to change to text for 13b
        )[1].slice(1),
      },
    ];
  } else {
    chart.data.datasets = [
      {
        label: "Probability of getting at least x units" + " lvl " + lvl,
        data: levelOutputData, //to change to text for 13b
      },
    ];
  }
  chart.update("none");
}

// CALCULATIONS

const setAttributes = {
  11: {
    totalUnits: [22, 20, 17, 10, 9],
    distinctChamps: [13, 13, 13, 12, 8],
    costProbs: [
      // level
      [1, 0, 0, 0, 0], // 1
      [1, 0, 0, 0, 0], // 2
      [0.75, 0.25, 0, 0, 0], // 3
      [0.55, 0.3, 0.15, 0, 0], // 4
      [0.45, 0.33, 0.2, 0.02, 0], // 5
      [0.3, 0.4, 0.25, 0.05, 0], // 6
      [0.19, 0.3, 0.4, 0.1, 0.01], // 7
      [0.18, 0.25, 0.32, 0.22, 0.03], // 8
      [0.1, 0.2, 0.25, 0.35, 0.1], // 9
      [0.05, 0.1, 0.2, 0.4, 0.25], // 10
      [0.01, 0.02, 0.12, 0.5, 0.35], // 11
    ],
  },
  12: {
    totalUnits: [30, 25, 18, 10, 9],
    distinctChamps: [14, 13, 13, 12, 8],
    costProbs: [
      // level
      [1, 0, 0, 0, 0], // 1
      [1, 0, 0, 0, 0], // 2
      [0.75, 0.25, 0, 0, 0], // 3
      [0.55, 0.3, 0.15, 0, 0], // 4
      [0.45, 0.33, 0.2, 0.02, 0], // 5
      [0.3, 0.4, 0.25, 0.05, 0], // 6
      [0.19, 0.3, 0.4, 0.1, 0.01], // 7
      [0.18, 0.25, 0.32, 0.22, 0.03], // 8
      [0.15, 0.2, 0.25, 0.3, 0.1], // 9
      [0.05, 0.1, 0.2, 0.4, 0.25], // 10
      [0.01, 0.02, 0.12, 0.5, 0.35], // 11
    ],
  },
  13: {
    totalUnits: [30, 25, 18, 10, 9],
    distinctChamps: [14, 13, 13, 12, 8],
    costProbs: [
      // level
      [1, 0, 0, 0, 0], // 1
      [1, 0, 0, 0, 0], // 2
      [0.75, 0.25, 0, 0, 0], // 3
      [0.55, 0.3, 0.15, 0, 0], // 4
      [0.45, 0.33, 0.2, 0.02, 0], // 5
      [0.3, 0.4, 0.25, 0.05, 0], // 6
      [0.19, 0.3, 0.4, 0.1, 0.01], // 7
      [0.18, 0.25, 0.32, 0.22, 0.03], // 8
      [0.15, 0.2, 0.25, 0.3, 0.1], // 9
      [0.05, 0.1, 0.2, 0.4, 0.25], // 10
      [0.01, 0.02, 0.12, 0.5, 0.35], // 11
    ],
  },
};

const expReq = [0, 0, 2, 6, 10, 20, 36, 48, 72, 84]; // https://leagueoflegends.fandom.com/wiki/Experience_(Teamfight_Tactics)

function getCostProb(lvl, cost, set) {
  // 1-indexed
  return setAttributes[set]["costProbs"][lvl - 1][cost - 1];
}

// Returns cumulative probability of getting 0-9 copies
// cost: Desired unit cost
// lvl: Current level
// a: Number of copies of this unit already out
// b: Number of units of the same cost already out
// gold: Amount of gold you want to roll
function getProbs(cost, lvl, a, b, gold, set) {
  if (gold == 0) return Array(2).fill(Array(10).fill(0));
  var mat = getTransitionMatrix(cost, lvl, a, b, set);
  mat = power(mat, 5 * Math.floor(gold / 2));

  // Probabilities for exactly 0, 1, 2, ..., 9 of desired unit
  const pprob = mat[0];

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

function getTransitionMatrix(cost, lvl, a, b, set) {
  const mat = [];
  for (let i = 0; i < 10; i++) {
    const newRow = [];
    for (let j = 0; j < 10; j++) {
      if (i == 9 && j == 9) {
        newRow.push(1); // from X >= 9 to X >= 9, probability is 1
        continue;
      }
      const p = getTransitionProb(cost, lvl, a + i, b + i, set);
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
function getTransitionProb(cost, lvl, a, b, set) {
  //   const totalUnits = set === 12 ? totalUnitsSet12 : totalUnitsSet11;
  const totalUnits = setAttributes[set]["totalUnits"];
  const distinctChamps = setAttributes[set]["distinctChamps"];
  const howManyLeft = Math.max(0, totalUnits[cost - 1] - a);
  const poolSize = totalUnits[cost - 1] * distinctChamps[cost - 1] - b;
  return getCostProb(lvl, cost, set) * (howManyLeft / poolSize);
}

//Matrix multiplication rounded to 3 d.p.
function multiply(a, b) {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumRows = b.length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
      m[r][c] = m[r][c];
    }
  }
  return m;
}

function power(a, n) {
  var newmat = a;
  for (let i = 0; i < n - 1; i++) {
    newmat = multiply(newmat, a);
  }
  return newmat;
}
