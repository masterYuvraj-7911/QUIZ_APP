import { data } from "./data.js";
const CURRENT_QUESTION_NO = parseInt(new URLSearchParams(window.location.search).get("question-no"));
const QUESTION = data[CURRENT_QUESTION_NO - 1] || data[0];
const CORRECT_OPTION = QUESTION.answer;
let time = 30;
const root = document.querySelector("#root");
const gameInfo = JSON.parse(localStorage.getItem("game-info"));

if (!gameInfo) location.href = "/index.html";
if (gameInfo.played === gameInfo.total) location.href = "/result.html";

root.innerHTML = `
<header>
<img src="./images/banner.png" />
<img src="./images/volumeUp.png" style="height: 50%;"/>
</header>
<div class="qn-container"><div class="qn-no">${CURRENT_QUESTION_NO}/25</div></div>
<div class="question">${QUESTION.title}</div>
<div class="timer-container"><div class="timer">00:30</div></div>
<div class="options-container">${QUESTION.options.map((e) => `<div class="option">${e}</div>`).join("")}</div>
<footer><div>Made by Yuvraj Kumar</div><button id="next-btn" disabled>NEXT &rarr;</button></footer>`;

const optionsElem = document.querySelectorAll(".option");
const timerElem = document.querySelector(".timer");
const nextBtn = document.querySelector("#next-btn");

optionsElem.forEach((elem) => elem.addEventListener("click", handleOptionClick));

nextBtn.addEventListener("click", () => (location.href = "./game.html?question-no=" + (CURRENT_QUESTION_NO + 1)));

function handleOptionClick(e) {
	clearInterval(timerId);
	if (this.innerText === CORRECT_OPTION) {
		this.classList.add("correct");
		localStorage.setItem("game-info", JSON.stringify({ ...gameInfo, win: ++gameInfo.win }));
	} else {
		this.classList.add("wrong");
		clickCorrect();
	}
	localStorage.setItem("game-info", JSON.stringify({ ...gameInfo, played: ++gameInfo.played }));
	nextBtn.disabled = false;
	optionsElem.forEach((el) => el.removeEventListener("click", handleOptionClick));
}

const timerId = setInterval(() => {
	timerElem.textContent = "00:" + (--time).toString().padStart(2, 0);
	if (time === 20) document.body.style.backgroundColor = "#E4E5C7";
	if (time === 10) document.body.style.backgroundColor = "#DBADAD";
	if (time === 0) {
		document.body.style.backgroundColor = "#9ce8ff";
		localStorage.setItem("game-info", JSON.stringify({ ...gameInfo, played: ++gameInfo.played }));
		nextBtn.disabled = false;
		clearInterval(timerId);
		clickCorrect();
	}
}, 1000);

function clickCorrect() {
	nextBtn.disabled = false;
	optionsElem.forEach((el) => el.textContent === CORRECT_OPTION && el.classList.add("correct"));
}
