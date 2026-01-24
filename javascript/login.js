const passwdInput = document.getElementById("passwd_reg");
const strengthBar = document.getElementById("strengthBar");

passwdInput.addEventListener("change", () => {
  const pwd = passwdInput.value;
  let score = 0;

  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[\W_]/.test(pwd)) score++;

  // Calculate width percentage
  const width = (score / 5) * 100;
  strengthBar.style.width = width + "%";

  // Change color based on score
  if (score <= 2) {
    strengthBar.style.backgroundColor = "red";
  } else if (score === 3 || score === 4) {
    strengthBar.style.backgroundColor = "orange";
  } else if (score === 5) {
    strengthBar.style.backgroundColor = "green";
  }

  console.log(score);
});

function getRandomRgb() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  if (r * 0.299 + g * 0.587 + b * 0.114 > 186) {
    return { rgb: `rgb(${r}, ${g}, ${b})`, dark: false };
  }
  return { rgb: `rgb(${r}, ${g}, ${b})`, dark: true };
}

const logSub = document.getElementById("login_sub");
const regSub = document.getElementById("reg_sub");
logSub.addEventListener("mouseover", () => {
  const color = getRandomRgb();
  logSub.style.backgroundColor = color.rgb;
  logSub.style.color = color.dark ? "white" : "black";
});
regSub.addEventListener("mouseover", () => {
  const color = getRandomRgb();
  regSub.style.backgroundColor = color.rgb;
  regSub.style.color = color.dark ? "white" : "black";
});
