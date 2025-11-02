const meterInput = document.getElementById('meters');
const calcBtn = document.getElementById('calcBtn');
const zeroBtn = document.getElementById('zeroBtn');
const airspeedEl = document.getElementById('airspeed');
const noteEl = document.getElementById('note');

// Polynomial coefficients (quadratic fit derived to match sample points):
// y = a*x^2 + b*x + c  where x is altitude in meters and y is airspeed in km/h
// Coeffs computed to match:
//   600 m -> ~320 km/h, 1200 m -> ~345 km/h, and constant ~16.40816
const coeffs = {
  a: -3.86658e-4,   // x^2 coefficient
  b: 0.73798056,    // x coefficient
  c: 16.40816       // constant term
};

function evaluatePolynomial(x){
  // Use the quadratic fit: y = a*x^2 + b*x + c
  return coeffs.a * x * x + coeffs.b * x + coeffs.c;
}

function formatNumber(n, digits=0){
  if (!isFinite(n)) return '—';
  return Number(n).toLocaleString(undefined, {maximumFractionDigits:digits});
}

function updateForMeters(meters){
  const m = Number(meters);
  if (!Number.isFinite(m) || m < 0){
    airspeedEl.textContent = '—';
    noteEl.style.display = 'none';
    return;
  }

  const speedKph = evaluatePolynomial(m); // polynomial now returns km/h

  // Show only km/h
  airspeedEl.textContent = formatNumber(speedKph, 0) + ' km/h';

  // Note about landing burn
  if (m <= 1000 && m >= 600){
    noteEl.style.display = 'block';
    noteEl.textContent = 'Approx landing burn region detected (landing burn starts ~800 m).';
  } else if (m < 600){
    noteEl.style.display = 'block';
    noteEl.textContent = 'Below typical landing-burn altitudes (~800 m).';
  } else {
    noteEl.style.display = 'none';
  }
}

// Event handlers
calcBtn.addEventListener('click', () => {
  updateForMeters(meterInput.value);
});

// Quick set to ~800 m for landing burn
zeroBtn.addEventListener('click', () => {
  meterInput.value = '800';
  updateForMeters(800);
});

// Recompute on enter
meterInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    updateForMeters(meterInput.value);
  }
});

// Initialize with placeholder value
meterInput.value = '';