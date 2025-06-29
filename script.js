// 1) Get DOM elements
const resultElement = document.getElementById("result");
const narutoImageElement = document.getElementById("narutoImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// Initialize variables
let usedNarutoIds = [];
let showLoading = false;
let count = 0;
let points = 0;

// Function to fetch one naruto with and ID
async function fetchNarutoById(id) {
  showLoading = true;
  const response = await fetch(
    `https://dattebayo-api.onrender.com/characters/${id}`
  );
  const data = await response.json();
  return data;
}

// 3) TEST function to see result of step 2
// async function testFetch() {
//   const naruto = await fetchNarutoById(getRandomNarutoId());
//   console.log(naruto);
// }

// 4) Call TEST function
// testFetch();

// Function to load question with options
async function loadQuestionWithOptions() {
  if (showLoading) {
    showLoadingWindow();
    hidePuzzleWindow();
  }

  // Fetch correct answer first
  let narutoId = getRandomNarutoId();
  while (usedNarutoIds.includes(narutoId)) {
    narutoId = getRandomNarutoId();
  }

  // 8.3) If a naruto has not been displayed yet, it is added to usedNarutoIds, and it is set as the new const naruto
  usedNarutoIds.push(narutoId);
  const naruto = await fetchNarutoById(narutoId);

  // 9.2) Create/reset the options array with the correct answer (naruto.name)
  const options = [naruto.name];
  const optionsIds = [naruto.id];

  // 10) Fetch additional random Naruto names to use as options
  while (options.length < 4) {
    let randomNarutoId = getRandomNarutoId();
    while (optionsIds.includes(randomNarutoId)) {
      randomNarutoId = getRandomNarutoId();
    }
    optionsIds.push(randomNarutoId);

    // 10.2) Fetching a random naruto with the newly made ID, and adding it to the options array.
    const randomNaruto = await fetchNarutoById(randomNarutoId);
    const randomOption = randomNaruto.name;
    options.push(randomOption);

    // 10.3) TEST show how arrays look.
    // console.log(options);
    // console.log(optionsIds);

    // 16.5) Turn of loading if all optiosn have been fetched.
    if (options.length === 4) {
      showLoading = false;
    }
  }

  // 12.2) Shuffle the 4 options array to always change the place of the right answer.
  shuffleArray(options);

  // 13) Clear any previous result and update naruto image to fetched image URL from the "sprites"
  resultElement.textContent = "Guess That Naruto Character";
  narutoImageElement.src = naruto.images;

  // 14) Create options HTML elements from options array in the DOM
  optionsContainer.innerHTML = "";
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = (event) => checkAnswer(option === naruto.name, event);
    optionsContainer.appendChild(button);
  });
  // 16.2) Hide / Unhide HTML elements based on async status
  if (!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
  }
}

// 11) Initial load
loadQuestionWithOptions();

// 15) Create check answer function
function checkAnswer(isCorrect, event) {
  const selectedButton = document.querySelector(".selected");
  if (selectedButton) {
    return;
  }

  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;

  if (isCorrect) {
    displayResult("Correct answer!", "correct");
    points++;
    pointsElement.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Wrong answer...", "wrong");
    event.target.classList.add("wrong");
  }

  setTimeout(() => {
    showLoading = true;
    loadQuestionWithOptions();
  }, 1000);
}

// --- UTILITY FUNCTIONS ---
function getRandomNarutoId() {
  return Math.floor(Math.random() * 151) + 1;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function displayResult(result) {
  resultElement.textContent = result;
}

function hideLoadingWindow() {
  loadingContainer.classList.add("hide");
}

function showLoadingWindow() {
  mainContainer[0].classList.remove("show");
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
}

function showPuzzleWindow() {
  loadingContainer.classList.remove("show");
  mainContainer[0].classList.remove("hide");
  mainContainer[0].classList.add("show");
}

function hidePuzzleWindow() {
  mainContainer[0].classList.add("hide");
}
