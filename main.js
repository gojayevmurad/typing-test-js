const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const startTest = document.querySelector("#start-test");
const stopTest = document.querySelector("#stop-test");

let mistakes = 0;
let time = 60;
let intervalTimer = "";
let reloadInterval = "";

//! START/STOP BUTTON :-)
stopTest.onclick = stop;
startTest.onclick = start;

//! GET AND ADD QUOTE
async function getQuote(url) {
  let response = await fetch(url);
  response = await response.json();
  let quote = response.content;

  let arr = quote.split("").map((char) => {
    let quoteChar = document.createElement("span");
    quoteChar.classList = "quote-chars";
    quoteChar.innerText = char;
    return quoteChar;
  });

  arr.map((el) => {
    quoteSection.appendChild(el);
  });
  return true;
}

//! CHECK USER INPUT
userInput.addEventListener("input", (e) => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars); // NODELIST == >> ARRAY
  quoteChars.map((char, index) => {
    if (char.innerText == userInput.value[index]) {
      char.classList.remove("fail");
      char.classList.add("success");
    } else if (userInput.value[index] == null) {
      char.classList.remove("success");
      char.classList.remove("fail");
    } else {
      if (!char.classList.contains("fail")) {
        char.classList.remove("success");
        char.classList.add("fail");
        mistakes++;
      }
    }
    document.querySelector("#mistakes").innerHTML = mistakes;
  });

  // CHECK CHARS
  let allCharsTrue = quoteChars.every((element) => {
    return element.classList.contains("success");
  });

  if (allCharsTrue) {
    stop();
  }
});

function timer() {
  if (time == 0) {
    result();
  } else {
    --time;
    document.querySelector("#timer").innerText = time;
  }
}

function reducer() {
  intervalTimer = setInterval(() => {
    timer();
  }, 1000);
}

function start() {
  userInput.disabled = false;
  userInput.value = "";
  mistakes = 0; 
  quoteSection.innerHTML = "";
  getQuote(quoteApiUrl);
  startTest.style.display = "none";
  stopTest.style.display = "block";
  document.querySelector(".result").style.display = "none";
  reducer();
}

function stop() {
  userInput.disabled = true;
  startTest.style.display = "block";
  stopTest.style.display = "none";
  document.querySelector(".result").style.display = "block";
  clearInterval(intervalTimer);
  let timeElapsed = 1;
  if (time != 0) {
    timeElapsed = (60 - time) / 60;
  }

  document.querySelector("#wpm").innerText =
    ((userInput.value.length - mistakes) / 5 / timeElapsed).toFixed(2) + "wpm";
  document.querySelector("#accuracy").innerText =
    (
      ((userInput.value.length - mistakes) / userInput.value.length) *
      100
    ).toFixed(2) + "%";

  time = 60;
  document.querySelector("#timer").innerHTML = time;
}

window.onload = () => {
  stopTest.style.display = "none";
  userInput.disabled = true;
  quoteSection.innerText = "Press start button for test your speed";
};
