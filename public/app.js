document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    const cards = [];
    let card1 = null;
    let card2 = null;
    let isLocked = false;
    let matchedPairs = 0;
    const totalPairs = letters.length;

    let startTime;
    let timerInterval;

    function startTimer() {
        startTime = new Date();
        timerInterval = setInterval(() => {
            const currentTime = new Date();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);
            const hours = Math.floor(elapsedTime / 3600);
            const minutes = Math.floor((elapsedTime % 3600) / 60);
            const seconds = elapsedTime % 60;

            document.getElementById('timer').textContent = `Time: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    const congratsPopup = document.createElement('div');
    congratsPopup.id = 'congratsPopup';
    congratsPopup.classList.add('popup');
    congratsPopup.innerHTML = 
        `<div class="popup-content">
            <h2>Congratulations!</h2>
            <p>You've matched all the cards!</p>
            <button id="playAgain">Play Again</button>
        </div>`;
    document.body.appendChild(congratsPopup);

    document.getElementById('playAgain').addEventListener('click', resetGame);

    for (let i = 0; i < 2; i++) {
        for (let x of letters) {
            cards.push(x);
        }
    }

    function addCard(x) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML =
            `<div class="front" style="color: #FF8C00;">${x}</div>` +
            `<div class="back" style="font-size: 50px;">&#128175;</div>`;

        card.addEventListener('click', flipCard);
        return card;
    }

    function rearrange(container) {
        for (let i = container.length - 1; i > 0; i--) {
            const j = Math.random() * (i + 1) | 0;
            [container[i], container[j]] = [container[j], container[i]];
        }
        return container;
    }

    function flipCard() {
        if (isLocked || this === card1) return;

        this.classList.add('flipped-card');

        if (!card1) {
            card1 = this;
            return;
        }

        card2 = this;
        isSame();
    }

    function isSame() {
        const isMatch = card1.innerText === card2.innerText;
        isMatch ? disableCards() : closeCards();
    }

    function resettingGame() {
        [card1, card2, isLocked] = [null, null, false];
    }

    function disableCards() {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedPairs += 1;
        resettingGame();
        if (matchedPairs === totalPairs) {
            setTimeout(showCongratsMessage, 500);
            stopTimer();
        }
    }

    function closeCards() {
        isLocked = true;
        setTimeout(() => {
            card1.classList.remove('flipped-card');
            card2.classList.remove('flipped-card');
            resettingGame();
        }, 1000);
    }

    function showCongratsMessage() {
        congratsPopup.style.display = 'flex';
    }

    function resetGame() {
        congratsPopup.style.display = 'none';
        gameBoard.innerHTML = '';
        matchedPairs = 0;
        initialiseGame();
    }

    function initialiseGame() {
        const rearrangedCards = rearrange(cards);
        rearrangedCards.forEach(x => {
            const card = addCard(x);
            gameBoard.appendChild(card);
        });
        startTimer(); 
    }

    initialiseGame();
});
