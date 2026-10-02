"use strict";

const form = document.querySelector("#timer-form");
const minutesInput = document.querySelector("#minutes");
const secondsInput = document.querySelector("#seconds");
const timeDisplay = document.querySelector("#time-display");
const message = document.querySelector("#timer-message");
const startPauseButton = document.querySelector("#start-pause");
const resetButton = document.querySelector("#reset");

let remainingSeconds = 300;
let endTime = 0;
let intervalId = null;
let state = "ready";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderTime() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

function readDuration() {
  const minutes = minutesInput.valueAsNumber;
  const seconds = secondsInput.valueAsNumber;

  if (
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    minutes < 0 ||
    minutes > 999 ||
    seconds < 0 ||
    seconds > 59
  ) {
    message.textContent = "Enter 0–999 minutes and 0–59 seconds.";
    return null;
  }

  const duration = minutes * 60 + seconds;
  if (duration === 0) {
    message.textContent = "Set a time greater than zero.";
    return null;
  }

  return duration;
}

function setRunning(running) {
  if (running) {
    state = "running";
  }
  minutesInput.disabled = running;
  secondsInput.disabled = running;
  startPauseButton.textContent = running ? "Pause" : "Start";
}

function tick() {
  remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  renderTime();

  if (remainingSeconds === 0) {
    window.clearInterval(intervalId);
    intervalId = null;
    setRunning(false);
    state = "completed";
    message.textContent = "Time's up!";
    startPauseButton.disabled = true;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state === "running") {
    window.clearInterval(intervalId);
    intervalId = null;
    remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    renderTime();
    setRunning(false);
    state = "paused";
    message.textContent = "Paused.";
    return;
  }

  if (state !== "paused") {
    const duration = readDuration();
    if (duration === null) {
      return;
    }
    remainingSeconds = duration;
  }

  renderTime();
  endTime = Date.now() + remainingSeconds * 1000;
  setRunning(true);
  message.textContent = "Timer running.";
  startPauseButton.disabled = false;
  intervalId = window.setInterval(tick, 200);
});

resetButton.addEventListener("click", () => {
  window.clearInterval(intervalId);
  intervalId = null;
  setRunning(false);
  state = "ready";
  startPauseButton.disabled = false;

  const minutes = minutesInput.valueAsNumber;
  const seconds = secondsInput.valueAsNumber;
  if (
    Number.isInteger(minutes) &&
    Number.isInteger(seconds) &&
    minutes >= 0 &&
    minutes <= 999 &&
    seconds >= 0 &&
    seconds <= 59
  ) {
    remainingSeconds = minutes * 60 + seconds;
    message.textContent = remainingSeconds > 0 ? "Ready when you are." : "Set a time greater than zero.";
  } else {
    remainingSeconds = 0;
    message.textContent = "Enter 0–999 minutes and 0–59 seconds.";
  }
  renderTime();
});

function updateFromInputs() {
  const minutes = minutesInput.valueAsNumber;
  const seconds = secondsInput.valueAsNumber;
  if (
    Number.isInteger(minutes) &&
    Number.isInteger(seconds) &&
    minutes >= 0 &&
    minutes <= 999 &&
    seconds >= 0 &&
    seconds <= 59
  ) {
    remainingSeconds = minutes * 60 + seconds;
    renderTime();
    state = "ready";
    startPauseButton.disabled = false;
    message.textContent = remainingSeconds > 0 ? "Ready when you are." : "Set a time greater than zero.";
  }
}

minutesInput.addEventListener("input", updateFromInputs);
secondsInput.addEventListener("input", updateFromInputs);
renderTime();
