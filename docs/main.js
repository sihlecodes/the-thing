const States = Object.freeze({
    BEGIN: 0,
    TTT_WON: 1,
    TTT_DRAW: 2,
    PRE_MAZE: 3,
    PRE_MAZE_TRANSITION: 5,
    TTT_LOST: 4,
    TTT_QUIZ_PASSED: 7,

    MAZE_COMPLETE: 8,
    MAZE_QUIZ_MESSAGE: 5,
    MAZE_QUIZ: 6,
    MAZE_QUIZ_MESSAGE_2: 9
});

async function loadPage(pageName) {
    const content = document.getElementById('content');
    const response = await fetch(`views/${pageName}.html`);
    const html = await response.text();
    const fragment = document.createRange().createContextualFragment(html);

    content.classList.add('fade-out');

    await new Promise(resolve => {
        content.addEventListener('transitionend', resolve, { once: true });
    });

    content.replaceChildren(fragment);
    content.classList.remove('fade-out');
}

async function showNarration({ hint = '', heading = '', message, callback, holdDuration = 500 } = {}) {
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

async function getNextState(currentState, holdDuration = 0) {
    await new Promise(resolve => setTimeout(resolve, holdDuration));
    const refreshPage = () => window.location.reload();

    console.log('Current state:', currentState);

    switch (currentState) {
        case States.BEGIN:
            showQuiz({
                message: 'The first time I met you was in WWG&nbsp;315. I asked the guys sitting next to me if I could borrow something, and from all the way across the room, you were the one who offered to lend me yours.<br><br>Do you remember what it was?',
                options: ['A ruler', 'A pen', 'A calculator', 'A pair of scissors'],

                correctAnswerCallback: () => {
                    loadPage('tic-tac-toe');
                    // getNextState(States.TTT_QUIZ_PASSED);
                },

                wrongAnswerCallback: () => {
                    showNarration({
                        message: 'Nope, that\'s not it. 😅',
                        hint: 'Tap and hold the screen if you want to try again.',
                        callback: refreshPage
                    });
                }
            });

            break;

        case States.TTT_LOST:
            showNarration({
                message: 'Ngl, it\'s kind of impressive that you managed to lose when I literally programmed the AI to let you win 😭🤣',
                hint: 'Tap and hold the screen if you want to try again.',
                callback: refreshPage
            });

            break;

        case States.TTT_DRAW:
            showNarration({
                message: 'How did you even manage a draw?? I programmed the AI to let you win 😭🤣',
                hint: 'Tap and hold the screen if you want to try again.',
                callback: refreshPage
            });

            break;

        case States.TTT_WON:
            showNarration({
                message: 'After you handed me the ruler, I remember just thinking about how stunning you looked. I told myself I\'d ask for your name when I return the ruler.<br><br>...I had it all planned out.',
                callback: () => {
                    showNarration({
                        message: '...but you ended up leaving before I did, and that caught me so off guard that I returned the ruler without even remembering to ask your name. 🥲',
                        callback: () => {
                            getNextState(States.PRE_MAZE_TRANSITION);
                        }
                    });
                }
            });
            break;

        case States.PRE_MAZE_TRANSITION:
            showNarration({
                message: 'A week or two passsed...',
                callback: () => {
                    getNextState(States.PRE_MAZE);
                }
            });
            break;

        case States.PRE_MAZE:
            showNarration({
                message: 'The second time I saw you, you were standing in the middle of a corridor in WWG, waiting for a lecturer to pass by so they could let you through to the other side of the building.',

                callback: () => {
                    showQuiz({
                        message: 'Do you remember which room it was that you were trying to get to?',
                        options: ['WWG 112', 'WWG 113', 'WWG 226', 'WWG 223'],
                        correctAnswerCallback: () => {
                            showNarration({
                                message: 'I had spotted you on my way down the stairs. We waved at each other and I kept walking. I was almost out of the building when it hit me:<br><br>"this might be my only chance in a while to talk to her."',
                                callback: () => {
                                    showNarration({
                                        message: 'So I turned around and walked back up, and you were still there. Turns out you didn\'t know there was another way around to that side of the building, so I offered to walk you there myself.',
                                        callback: () => {
                                            loadPage('maze');
                                        }
                                    });
                                }
                            });

                        },

                        wrongAnswerCallback: () => {
                            showNarration({
                                hint: 'Tap and hold the screen if you want to try again.',
                                message: 'Nope, that\'s not it. 😅',
                                callback: refreshPage
                            });
                        }
                    });
                }
            });
            break;

        case States.MAZE_COMPLETE:
            getNextState(States.MAZE_QUIZ_MESSAGE_2);
            break;

        case States.MAZE_QUIZ_MESSAGE_2:
            showNarration({
                message: 'On the way, I asked what your name was and after that, you said something I still remember:<br><br>"I feel like WWG is a puzzle."',
                callback: () => {
                    showNarration({
                        message: 'When we got there, you said, "Thanks, Sihle"... and I remember thinking my name had never sounded that beautiful before.<br><br>There was just something in the way you said it.',
                        callback: () => {
                            showNarration({
                                hint: 'I\'ve linked my WhatsApp, so if you\'d like, tap and hold one last time to send me a message.',
                                message: 'It\'s funny that, after all that, the only things I actually know about you are your name, that you own a ruler 😂, and that WWG feels like a puzzle to you (you\'re not alone in that)<br><br>...I\'d love to know more about you.',
                                callback: () => {
                                    window.location.href = 'https://wa.me/27633994508?text=Hello Sihle';
                                }
                            });
                        },
                    });
                }
            });
        case States.MAZE_QUIZ:
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

loadPage('tic-tac-toe');
// getNextState(States.BEGIN);
// getNextState(States.MAZE_COMPLETE);

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

// loadPage('maze');