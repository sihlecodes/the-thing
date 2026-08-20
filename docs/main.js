const States = Object.freeze({
    TTT_WON: 1,
    TTT_DRAW: 2,
    TTT_QUIZ: 3,
    MAZE_COMPLETE: 4,
    MAZE_QUIZ: 5,
});

async function loadPage(pageName) {
    const content = document.getElementById('content');
    const response = await fetch(`views/${pageName}.html`);
    const html = await response.text();
    const fragment = document.createRange().createContextualFragment(html);

    content.innerHTML = '';
    content.appendChild(fragment);
}

async function showNaration(heading, message, callback) {
    await loadPage('naration');

    naration.setHeading(heading);
    naration.setMessage(message);
    naration.setCallback(callback);
};

async function showQuiz(heading, message, options, correctAnswerCallback, wrongAnswerCallback) {
    await loadPage('quiz');

    quiz.setHeading(heading);
    quiz.setMessage(message);
    quiz.setCorrectAnswerCallback(correctAnswerCallback);
    quiz.setWrongAnswerCallback(wrongAnswerCallback);

    // should be called after setting callbacks
    quiz.setOptions(options);
};

function getNextState(currentState) {
    console.log('Current state:', currentState);

    switch (currentState) {
        case States.TTT_WON:
            showNaration('Congratulations', 'You have won the game of Tic Tac Toe', () => {
                getNextState(States.TTT_QUIZ);
                console.log('done!');
                console.log('calling back from ttt won');
            });

            break;

        case States.TTT_DRAW:
            showNaration('Oh no Thobile', 'The game has ended in a draw', () => {
                window.location.reload();
            });

            break;

        case States.TTT_QUIZ:
            console.log('quiz time');
            showQuiz('Tic Tac Toe Quiz',
                'You have completed the game of Tic Tac Toe! Now answer this question to proceed.',
                ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                () => {
                    loadPage('maze');
                    console.log('Correct answer!');
                },
                () => {
                    console.log('Wrong answer!');
                    window.location.reload();
                },
            );
            break;

        case States.MAZE_COMPLETE:
            console.log('maze complete');
            showNaration('Congratulations', 'You have completed the maze!', () => {
                getNextState(States.MAZE_QUIZ);
                console.log('done!');
            });
            break;

        case States.MAZE_QUIZ:
            console.log('maze quiz time');
            showQuiz('Maze Quiz',
                'You have completed the maze! Now answer this question to proceed.',
                ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                () => { console.log('Correct answer!'); },
                () => { console.log('Wrong answer!'); },
            );
            break;

        default:
            console.log('Unknown state');
    }
}

loadPage('tic-tac-toe');

// showQuiz('Tic Tac Toe Quiz',
//     'You have completed the game of Tic Tac Toe! Now answer this question to proceed.',
//     ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//     () => { console.log('Correct answer!'); },
//     () => { console.log('Wrong answer!'); }
// );

// showNaration('Tic Tac Toe Quiz',
//     'You have completed the game of Tic Tac Toe! Now answer this question to proceed.',
//     () => { console.log('Correct answer!'); },
// );

// loadPage('maze');