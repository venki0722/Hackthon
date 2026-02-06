/* ===============================
   H.A.N.S – CORE CONFIG
================================ */
const HISTORICAL_AVERAGE = 180; // MW (derived from 3-year dataset)
let chart;

/* ===============================
   APP START
================================ */
function startApp() {
  // Welcome → Dashboard transition
  welcome.classList.add("fade-out");

  setTimeout(() => {
    welcome.style.display = "none";
    dashboard.style.display = "block";
    dashboard.classList.add("fade-in");
  }, 800);
}

/* ===============================
   MAIN PREDICTION ENGINE
================================ */
function predict() {
  const t = Number(temp.value);
  const h = Number(hum.value);
  const w = Number(wind.value);

  // Input validation
  if (isNaN(t) || isNaN(h) || isNaN(w)) {
    alertText.innerText = "Please enter valid atmospheric parameters.";
    alertOverlay.style.display = "flex";
    return;
  }

  // Animate output counters
  animateValue(oTemp, 0, t, 600);
  animateValue(oHum, 0, h, 600);
  animateValue(oWind, 0, w, 600);

  /* ===============================
     ML-INSPIRED PREDICTION LOGIC
     (Trained conceptually on 3-year data)
  ================================ */

  const solarPower = Math.max(0, (t * 2.2) - (h * 0.6));
  const windPower = w * 9;
  const totalPower = solarPower + windPower;

  animateValue(solar, 0, solarPower.toFixed(1), 700);
  animateValue(windP, 0, windPower.toFixed(1), 700);
  animateValue(totalEl, 0, totalPower.toFixed(1), 900);

  /* ===============================
     GRID DECISION LOGIC
  ================================ */
  if (totalPower < HISTORICAL_AVERAGE) {
    gridMsg.innerText =
      "⚠ Renewable deficit detected. Backup scheduling required.";
    gridMsg.style.color = "#ffeb3b";
    showAlert(totalPower);
  } else {
    gridMsg.innerText =
      "✅ Renewable supply sufficient. Optimal grid operation.";
    gridMsg.style.color = "#00e676";
  }

  drawChart(solarPower, windPower);
}

/* ===============================
   CHART RENDERING
================================ */
function drawChart(solar, wind) {
  if (chart) chart.destroy();

  chart = new Chart(energyChart, {
    type: "bar",
    data: {
      labels: ["Solar Energy", "Wind Energy"],
      datasets: [{
        label: "Predicted Power (MW)",
        data: [solar, wind],
        backgroundColor: [
          "rgba(255,202,40,0.85)",
          "rgba(129,212,250,0.85)"
        ],
        borderRadius: 12
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1400,
        easing: "easeOutBounce"
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
            font: { size: 14 }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        x: {
          ticks: { color: "white" },
          grid: { display: false }
        }
      }
    }
  });
}

/* ===============================
   ALERT SYSTEM
================================ */
function showAlert(totalPower) {
  alertText.innerText =
    `Predicted renewable generation is ${totalPower.toFixed(1)} MW,
which is below the 3-year historical average of ${HISTORICAL_AVERAGE} MW.
This may cause grid instability. Immediate corrective action is recommended.`;

  alertOverlay.style.display = "flex";
  alertOverlay.classList.add("alert-animate");
}

function closeAlert() {
  alertOverlay.classList.remove("alert-animate");
  alertOverlay.style.display = "none";
}

/* ===============================
   NUMBER ANIMATION HELPER
================================ */
function animateValue(element, start, end, duration) {
  let startTime = null;
  end = Number(end);

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.innerText = value;

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      element.innerText = end;
    }
  }

  requestAnimationFrame(animation);
}

/* ===============================
   DOM REFERENCES
================================ */
const totalEl = document.getElementById("total");