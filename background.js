chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START_TEST") {
        const { numExercises, timeLimit } = message;
        // Here, you would set up the logic to start the test, similar to the Python script.
        // For example, you might open `test.html` in a new tab and pass the settings.
        console.log(`Starting test with ${numExercises} exercises and a time limit of ${timeLimit} minutes.`);
    }
});
