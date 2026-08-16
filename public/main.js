async function loadTicTacToe() {
    const response = await fetch('views/tic-tac-toe.html');
    const html = await response.text();

    const fragment = document.createRange().createContextualFragment(html);
    const content = document.getElementById('content');

    content.appendChild(fragment);
}

loadTicTacToe();