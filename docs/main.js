const States = Object.freeze({
    TTT_WON: 1,
    TTT_DRAW: 2
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

function getNextState(currentState) {
    switch (currentState) {
        case States.TTT_WON:
            showNaration('Congratulations', 'You have won the game of Tic Tac Toe', () => {
                console.log('done!');
            });

            break;

        case States.TTT_DRAW:
            showNaration('Oh no Thobile', 'The game has ended in a draw', () => {
                window.location.reload();
            });

            break;

        default:
            console.log('Unknown state');
    }
}

loadPage('tic-tac-toe');