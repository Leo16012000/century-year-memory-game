let exercises = []
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['numExercises', 'timeLimit'], function(data) {
        initializeTest(data.numExercises, data.timeLimit);
    });
});

function initializeTest(numExercises, timeLimit) {
    const exercises = generateExercises(numExercises);
    displayExercises(exercises);

    // Setup for ending memorization early
    const endEarlyBtn = document.createElement('button');
    endEarlyBtn.textContent = 'End Memorization Early 🧠';
    endEarlyBtn.addEventListener('click', endMemorization);
    document.body.appendChild(endEarlyBtn);

    // Start memorization timer with a default or user-defined time
    startTimer(timeLimit, 'Memorize the answers!', endMemorization); // 5 minutes for memorization
}

function generateExercises(numExercises) {
    exercises = [];
    for (let i = 0; i < numExercises; i++) {
        // Randomly decide the type of exercise
        if (Math.random() > 0.5) {
            // Century to Year exercise
            const century = getRandomInt(10, 20);
            const twoDigits = getRandomInt(0, 99);
            const operator = Math.random() > 0.5 ? '+' : '-';
            const answer = operator === '+' ? (century - 1) * 100 + twoDigits : (century - 1) * 100 + (100 - twoDigits);
            exercises.push({ type: 'Century to Year', question: `${century} ${operator} ${String(twoDigits).padStart(2, '0')}`, answer: String(answer) });
        } else {
            // Year to Century exercise
            const year = getRandomInt(1000, 2099);
            const answer = Math.ceil(year / 100);
            exercises.push({ type: 'Year to Century', question: `Century of year ${year}?`, answer: String(answer) });
        }
    }
    return exercises;
}

function displayExercises(exercises) {
    const container = document.getElementById('exercises');
    exercises.forEach((exercise, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>Exercise ${index + 1} (${exercise.type}):</strong> ${exercise.question} = ...`;
        container.appendChild(div);
    });
}

function startTimer(duration, message, callback) {
    const timerDisplay = document.getElementById('timer');
    let time = duration * 60; // Convert minutes to seconds
    timerDisplay.textContent = message + ' ' + duration + ':00';

    const timer = setInterval(() => {
        time--;
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.textContent = `${message} ${minutes}:${seconds}`;

        if (time <= 0) {
            clearInterval(timer);
            callback();
        }
    }, 1000);
}

function endMemorization() {
    document.getElementById('exercises').style.display = 'none'; // Hide exercises
    document.querySelectorAll('button').forEach(btn => btn.remove()); // Remove buttons

    const answerInput = document.createElement('input');
    answerInput.size = 100
    answerInput.type = 'text';
    answerInput.placeholder = 'Enter all answers concatenated and seperate by \',\'';
    document.body.appendChild(answerInput);

    const checkAnswerBtn = document.createElement('button');
    checkAnswerBtn.textContent = 'Check Answer';
    checkAnswerBtn.onclick = function() {
        checkFinalAnswer(answerInput.value);
    };
    document.body.appendChild(checkAnswerBtn);
}

function checkFinalAnswer(userAnswer) {
    chrome.storage.local.get(['numExercises'], function(data) {
        const correctAnswers = exercises.map(e => e.answer).join(',');
        if (userAnswer === correctAnswers) {
            showCustomModal('Correct! 🎉 Well done.');
        } else {
            showCustomModal(`Incorrect. 😕 The correct answer was ${correctAnswers}.`);
        }
    });
    document.getElementById('exercises').style.display = 'block'; 
    const container = document.getElementById('exercises');
    container.innerHTML='';
    exercises.forEach((exercise, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>Exercise ${index + 1} (${exercise.type}):</strong> ${exercise.question} = <span>${exercise.answer}</span>`;
        container.appendChild(div);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to show the custom modal with a message
function showCustomModal(message) {
    document.getElementById('customModalContent').innerHTML = message;
    document.getElementById('customModal').style.display = "block";
}

// Function to hide the custom modal
function hideCustomModal() {
    document.getElementById('customModal').style.display = "none";
}

// Close the modal when the user clicks on <span> (x)
document.getElementById('customModalClose').onclick = function() {
    hideCustomModal();
}
// Close the modal if the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == document.getElementById('customModal')) {
        hideCustomModal();
    }
}
