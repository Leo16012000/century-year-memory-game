document.getElementById('setupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const numExercises = document.getElementById('numExercises').value;
    const timeLimit = document.getElementById('timeLimit').value;

    chrome.storage.local.set({numExercises, timeLimit}, () => {
        chrome.tabs.create({url: 'test.html'});
    });
});
