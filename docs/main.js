const States = Object.freeze({
    TTT_WON: 1,
    TTT_DRAW: 2,
    TTT_QUIZ: 3,
    TTT_LOST_MESSAGE: 4,
    TTT_QUIZ_MESSAGE: 7,

    MAZE_COMPLETE: 8,
    MAZE_QUIZ_MESSAGE: 5,
    MAZE_QUIZ: 6,
});

async function loadPage(pageName) {
    const content = document.getElementById('content');
    const response = await fetch(`views/${pageName}.html`);
    const html = await response.text();
    const fragment = document.createRange().createContextualFragment(html);

    content.innerHTML = '';
    content.appendChild(fragment);
}

async function showNaration(heading, message, callback, holdDuration = 1000) {
    await loadPage('narration');

    narration.setHeading(heading);
    narration.setMessage(message);
    narration.setCallback(callback);
    narration.setHoldDuration(holdDuration);
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
            showQuiz('Tic Tac Toe Quiz',
                'The day I first met you, you lent me something... what was it?',
                ['A ruler', 'A pen', 'A calculator'],
                () => {
                    getNextState(States.TTT_QUIZ_MESSAGE);
                },
                () => {
                    showNaration('Wrong Answer',
                        'You have answered the quiz incorrectly. Please try again.',
                        () => { window.location.reload(); });
                },
            );

            break;

        case States.TTT_LOST_MESSAGE:
            showNaration('Oh no Thobile', 'You have lost the game of Tic Tac Toe', () => {
                window.location.reload();
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
                    showNaration('Wrong Answer',
                        'You have answered the quiz incorrectly. Please try again.',
                        () => { window.location.reload(); });
                },
            );
            break;

        case States.TTT_QUIZ_MESSAGE:
            showNaration('Congratulations', 'On my way back to my seat I remember thinking about how stunning you were.', () => {
                loadPage('maze');
                console.log('done!');
            });
            break;

        case States.MAZE_COMPLETE:
            getNextState(States.QUIZ);
            break;

        case States.MAZE_QUIZ_MESSAGE:
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
                () => {
                    showNaration('Final Quiz',
                        'You have completed the maze! Now answer this final question to proceed.',
                        () => {
                            window.location.href = 'https://wa.me/27633994508?text=Hello Sihle';
                            console.log('Correct answer!')
                        }, 3000);
                },
                () => {
                    showNaration('Wrong Answer',
                        'You have answered the quiz incorrectly. Please try again.',
                        () => { window.location.reload(); });
                },
            );
            break;

        default:
            console.log('Unknown state');
    }
}

// loadPage('tic-tac-toe');
getNextState(States.TTT_WON);

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