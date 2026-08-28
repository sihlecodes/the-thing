const States = Object.freeze({
    TTT_WON: 1,
    TTT_DRAW: 2,
    // TTT_QUIZ: 3,
    TTT_LOST: 4,
    TTT_QUIZ_PASSED: 7,

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

async function showNarration({ hint = '', heading = '', message, callback, holdDuration = 1000 } = {}) {
    await loadPage('narration');

    if (heading.length > 0)
        narration.showHeading();

    if (hint.length > 0)
        narration.setHint(hint);

    narration.setHeading(heading);
    narration.setMessage(message);
    narration.setCallback(callback);
    narration.setHoldDuration(holdDuration);
};

async function showQuiz({ heading = '', message, options, correctAnswerCallback, wrongAnswerCallback } = {}) {
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

    const refreshPage = () => window.location.reload();

    switch (currentState) {
        case States.TTT_WON:
            showQuiz({
                message: 'The day I first met you, you lent me something... what was it?',
                options: ['A ruler', 'A pen', 'A calculator'],

                correctAnswerCallback: () => {
                    getNextState(States.TTT_QUIZ_MESSAGE);
                },

                wrongAnswerCallback: () => {
                    showNarration({
                        hint: 'Tap and hold the screen if you want to try again.',
                        message: 'That\'s not right. 😭',
                        callback: refreshPage
                    });
                }
            });

            break;

        case States.TTT_LOST:
            showNarration({
                hint: 'Tap and hold the screen if you want to try again.',
                message: 'It\'s actually impressive that you managed to lose considering that I intentionally programmed the AI to let you win. 😭🤣',
                callback: refreshPage
            });

            break;

        case States.TTT_DRAW:
            showNarration({
                hint: 'Tap and hold the screen if you want to try again.',
                message: 'How did you even manage to get a draw? I literally programmed the AI to let you win. 😭🤣',
                callback: refreshPage
            });

            break;

        case States.TTT_QUIZ_PASSED:
            showNarration({
                message: 'On my way back from getting the ruler from you, I remember thinking about how stunning you were. When I got back to my seat, all I could think about was how I should have asked your name.',
                callback: () => { loadPage('maze'); }
            });
            break;

        case States.MAZE_COMPLETE:
            getNextState(States.MAZE_QUIZ);
            break;

        case States.MAZE_QUIZ:
            showQuiz({
                message: 'The second time I saw you, you were standing in the middle of the corridor, hoping that a lecturer would show up and open the door that leads to which room?',
                options: ['WWG 112', 'WWG 113', 'WWG 226', 'WWG 223'],

                correctAnswerCallback: () => {
                    showNarration({
                        hint: 'If you tap and hold one last time, I\'ve linked my WhatsApp, so you can send me a text message if you want to.',
                        message: 'So far the only things I know about you is your name, that you own a ruler 😂, and that WWG is a like a "puzzle" to you (you\'re not alone in thinking that 😭) ...I would love to know more about you.',
                        callback: () => {
                            window.location.href = 'https://wa.me/27633994508?text=Hello Sihle';
                            console.log('Correct answer!')
                        }
                    });
                },

                wrongAnswerCallback: () => {
                    showNarration({
                        heading: 'Wrong Answer',
                        message: 'You have answered the quiz incorrectly. Please try again.',
                        callback: refreshPage
                    });
                }
            });
            break;

        case States.MAZE_QUIZ_MESSAGE:
            showNarration({
                heading: 'Congratulations',
                message: 'You have completed the maze!',

                callback: () => {
                    getNextState(States.MAZE_QUIZ);
                    console.log('done!');
                }
            });
            break;

        default:
            console.log('Unknown state');
    }
}

// loadPage('tic-tac-toe');
// getNextState(States.MAZE_QUIZ);

// showQuiz('Tic Tac Toe Quiz',
//     'You have completed the game of Tic Tac Toe! Now answer this question to proceed.',
//     ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//     () => { console.log('Correct answer!'); },
//     () => { console.log('Wrong answer!'); }
// );

// showNarration('Tic Tac Toe Quiz',
//     'You have completed the game of Tic Tac Toe! Now answer this question to proceed.',
//     () => { console.log('Correct answer!'); },
// );

loadPage('maze');