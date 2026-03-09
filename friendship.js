// =========================================================
// Who Knows Me Better - Beginner Friendly JavaScript
// =========================================================
// This app has two main screens:
// 1) Host screen: enter your name and generate a shareable link.
// 2) Player screen: enter your name, answer 20 questions, see score + leaderboard.
//
// Data is stored in localStorage (browser only, no backend).
// =========================================================

// To add more questions later, just add more objects in this array.
// Each question needs: text, image, options (4 items), and correctIndex.
const QUESTIONS = [
  { text: "What is my favorite breakfast?", image: "https://picsum.photos/seed/q1/900/500", options: ["Pancakes", "Omelette", "Cereal", "Fruit salad"], correctIndex: 0 },
  { text: "Which music type do I enjoy most?", image: "https://picsum.photos/seed/q2/900/500", options: ["Afrobeat", "Pop", "Gospel", "Hip-hop"], correctIndex: 2 },
  { text: "What time do I usually wake up?", image: "https://picsum.photos/seed/q3/900/500", options: ["5:00 AM", "6:30 AM", "8:00 AM", "10:00 AM"], correctIndex: 1 },
  { text: "Which snack do I pick first?", image: "https://picsum.photos/seed/q4/900/500", options: ["Popcorn", "Chocolate", "Cookies", "Chips"], correctIndex: 3 },
  { text: "What is my favorite school subject?", image: "https://picsum.photos/seed/q5/900/500", options: ["Math", "English", "Science", "History"], correctIndex: 0 },
  { text: "Which app do I open most often?", image: "https://picsum.photos/seed/q6/900/500", options: ["YouTube", "Instagram", "WhatsApp", "TikTok"], correctIndex: 2 },
  { text: "What is my favorite drink?", image: "https://picsum.photos/seed/q7/900/500", options: ["Water", "Mango juice", "Coffee", "Tea"], correctIndex: 1 },
  { text: "Which sport do I like watching?", image: "https://picsum.photos/seed/q8/900/500", options: ["Football", "Basketball", "Tennis", "Rugby"], correctIndex: 0 },
  { text: "What is my favorite season?", image: "https://picsum.photos/seed/q9/900/500", options: ["Summer", "Rainy", "Winter", "Spring"], correctIndex: 3 },
  { text: "Which color do I wear most?", image: "https://picsum.photos/seed/q10/900/500", options: ["Black", "Blue", "White", "Green"], correctIndex: 0 },
  { text: "What is my dream vacation place?", image: "https://picsum.photos/seed/q11/900/500", options: ["Bali", "Cape Town", "Dubai", "Tokyo"], correctIndex: 3 },
  { text: "How do I spend free time?", image: "https://picsum.photos/seed/q12/900/500", options: ["Reading", "Gaming", "Cooking", "Napping"], correctIndex: 0 },
  { text: "Which dessert do I love?", image: "https://picsum.photos/seed/q13/900/500", options: ["Ice cream", "Cake", "Donuts", "Pudding"], correctIndex: 1 },
  { text: "What pet would I choose?", image: "https://picsum.photos/seed/q14/900/500", options: ["Dog", "Cat", "Parrot", "Fish"], correctIndex: 0 },
  { text: "Which shoe style do I prefer?", image: "https://picsum.photos/seed/q15/900/500", options: ["Sneakers", "Boots", "Sandals", "Loafers"], correctIndex: 0 },
  { text: "What kind of movies do I enjoy?", image: "https://picsum.photos/seed/q16/900/500", options: ["Action", "Comedy", "Romance", "Documentary"], correctIndex: 1 },
  { text: "What is my favorite fruit?", image: "https://picsum.photos/seed/q17/900/500", options: ["Apple", "Mango", "Banana", "Orange"], correctIndex: 1 },
  { text: "Which phone mode do I use most?", image: "https://picsum.photos/seed/q18/900/500", options: ["Dark mode", "Light mode", "Auto", "Battery saver"], correctIndex: 0 },
  { text: "What is my favorite day of the week?", image: "https://picsum.photos/seed/q19/900/500", options: ["Monday", "Wednesday", "Friday", "Sunday"], correctIndex: 3 },
  { text: "How would I describe myself?", image: "https://picsum.photos/seed/q20/900/500", options: ["Quiet", "Funny", "Focused", "Adventurous"], correctIndex: 2 }
];

const screen = document.getElementById("screen");

// This object stores quiz session values while a player is answering.
const state = {
  quizId: "",
  ownerName: "",
  playerName: "",
  currentQuestionIndex: 0,
  score: 0
};

init();

function init() {
  const params = new URLSearchParams(window.location.search);
  const quizParam = params.get("quiz");

  if (!quizParam) {
    renderHostScreen();
    return;
  }

  const quizData = decodeQuizData(quizParam);
  if (!quizData || !quizData.quizId || !quizData.ownerName) {
    renderInvalidLinkScreen();
    return;
  }

  state.quizId = quizData.quizId;
  state.ownerName = quizData.ownerName;
  renderPlayerStartScreen();
}

function renderHostScreen() {
  screen.innerHTML = `
    <div class="card">
      <h2>Create Your Share Link</h2>
      <p>Enter your name, then generate a unique quiz link for friends.</p>
      <div class="field">
        <label for="ownerName">Your Name</label>
        <input id="ownerName" type="text" placeholder="Example: Maggie" />
      </div>
      <div class="actions">
        <button id="generateLinkBtn">Generate Quiz Link</button>
      </div>
      <div id="hostFeedback"></div>
    </div>
  `;

  document.getElementById("generateLinkBtn").addEventListener("click", generateQuizLink);
}

function generateQuizLink() {
  const ownerNameInput = document.getElementById("ownerName");
  const feedback = document.getElementById("hostFeedback");
  const ownerName = ownerNameInput.value.trim();

  if (!ownerName) {
    feedback.innerHTML = `<p class="result">Please enter your name first.</p>`;
    return;
  }

  const quizData = {
    quizId: generateId(),
    ownerName
  };

  const encodedQuiz = encodeQuizData(quizData);
  const shareUrl = `${window.location.origin}${window.location.pathname}?quiz=${encodedQuiz}`;

  feedback.innerHTML = `
    <p class="result">Link ready! Share this with your friends:</p>
    <div class="share-link" id="shareLinkText">${shareUrl}</div>
    <div class="actions">
      <button id="copyLinkBtn" class="secondary">Copy Link</button>
    </div>
  `;

  document.getElementById("copyLinkBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      feedback.innerHTML += `<p>Link copied to clipboard.</p>`;
    } catch (error) {
      feedback.innerHTML += `<p>Could not copy automatically. Please copy manually.</p>`;
    }
  });
}

function renderPlayerStartScreen() {
  screen.innerHTML = `
    <div class="card">
      <h2>${state.ownerName}'s Who Knows Me Better Quiz</h2>
      <p>Enter your name before starting the quiz.</p>
      <div class="field">
        <label for="playerName">Your Name</label>
        <input id="playerName" type="text" placeholder="Example: Alex" />
      </div>
      <div class="actions">
        <button id="startQuizBtn">Start Quiz</button>
      </div>
      <div id="startFeedback"></div>
    </div>
    <div class="leaderboard" id="leaderboardArea"></div>
  `;

  document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
  renderLeaderboard(state.quizId);
}

function startQuiz() {
  const playerNameInput = document.getElementById("playerName");
  const feedback = document.getElementById("startFeedback");
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    feedback.innerHTML = `<p class="result">Please enter your name to begin.</p>`;
    return;
  }

  state.playerName = playerName;
  state.currentQuestionIndex = 0;
  state.score = 0;

  renderQuestionScreen();
}

function renderQuestionScreen() {
  const question = QUESTIONS[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === QUESTIONS.length - 1;

  screen.innerHTML = `
    <div class="card">
      <h2>${state.ownerName}'s Quiz</h2>
      <p class="progress">Question ${state.currentQuestionIndex + 1} of ${QUESTIONS.length}</p>
      <img class="question-image" src="${question.image}" alt="Question ${state.currentQuestionIndex + 1}" />
      <h3>${question.text}</h3>
      <div class="choices" id="choiceList">
        ${question.options
          .map(
            (option, optionIndex) => `
          <button class="answer-btn" data-index="${optionIndex}">${option}</button>
        `
          )
          .join("")}
      </div>
      <div class="actions">
        <button id="nextBtn">${isLastQuestion ? "Finish Quiz" : "Next"}</button>
      </div>
      <div id="questionFeedback"></div>
    </div>
  `;

  let selectedIndex = null;
  const answerButtons = document.querySelectorAll(".answer-btn");

  answerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      answerButtons.forEach((b) => b.classList.remove("selected"));
      button.classList.add("selected");
      selectedIndex = Number(button.dataset.index);
    });
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    const feedback = document.getElementById("questionFeedback");

    if (selectedIndex === null) {
      feedback.innerHTML = `<p class="result">Please select an answer before continuing.</p>`;
      return;
    }

    if (selectedIndex === question.correctIndex) {
      state.score += 1;
    }

    if (isLastQuestion) {
      saveScoreToLeaderboard(state.quizId, state.playerName, state.score);
      renderResultScreen();
      return;
    }

    state.currentQuestionIndex += 1;
    renderQuestionScreen();
  });
}

function renderResultScreen() {
  const message = getFriendMessage(state.score, QUESTIONS.length);

  screen.innerHTML = `
    <div class="card">
      <h2>Quiz Complete</h2>
      <p class="result">${state.playerName}, your score is ${state.score}/${QUESTIONS.length}</p>
      <p class="result-message">${message}</p>
      <div class="actions">
        <button id="playAgainBtn" class="secondary">Play Again</button>
      </div>
    </div>
    <div class="leaderboard" id="leaderboardArea"></div>
  `;

  document.getElementById("playAgainBtn").addEventListener("click", () => {
    state.currentQuestionIndex = 0;
    state.score = 0;
    renderQuestionScreen();
  });

  renderLeaderboard(state.quizId);
}

function getFriendMessage(score, total) {
  const percent = score / total;

  if (percent >= 0.85) {
    return "Best Friend 🌟";
  }

  if (percent >= 0.5) {
    return "Good Friend 😊";
  }

  return "You barely know me 😅";
}

function saveScoreToLeaderboard(quizId, playerName, score) {
  const key = getLeaderboardKey(quizId);
  const leaderboard = JSON.parse(localStorage.getItem(key) || "[]");

  leaderboard.push({
    playerName,
    score,
    timestamp: Date.now()
  });

  localStorage.setItem(key, JSON.stringify(leaderboard));
}

function renderLeaderboard(quizId) {
  const leaderboardArea = document.getElementById("leaderboardArea");
  if (!leaderboardArea) {
    return;
  }

  const key = getLeaderboardKey(quizId);
  const leaderboard = JSON.parse(localStorage.getItem(key) || "[]");

  leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      return a.timestamp - b.timestamp;
    }
    return b.score - a.score;
  });

  if (leaderboard.length === 0) {
    leaderboardArea.innerHTML = `
      <h3>Leaderboard</h3>
      <p class="empty-note">No players yet. Be the first one!</p>
    `;
    return;
  }

  const rows = leaderboard
    .map(
      (entry, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.playerName}</td>
        <td>${entry.score}/${QUESTIONS.length}</td>
      </tr>
    `
    )
    .join("");

  leaderboardArea.innerHTML = `
    <h3>Leaderboard</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderInvalidLinkScreen() {
  screen.innerHTML = `
    <div class="card">
      <h2>Invalid Quiz Link</h2>
      <p>This share link is broken or incomplete.</p>
      <p><a href="${window.location.pathname}">Create a new quiz</a></p>
    </div>
  `;
}

function getLeaderboardKey(quizId) {
  return `who_knows_me_better_${quizId}`;
}

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function encodeQuizData(quizData) {
  return encodeURIComponent(JSON.stringify(quizData));
}

function decodeQuizData(encodedText) {
  try {
    return JSON.parse(decodeURIComponent(encodedText));
  } catch (error) {
    return null;
  }
}
