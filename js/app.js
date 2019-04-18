// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function shuffleCards() {

	// shuffle the cards
	const shuffledDeck = shuffle(cards);

	// append the shuffled cards to fragment
	for (const card of shuffledDeck) {
		fragment.appendChild(card);
	}

	// append the cards to .deck
	deck.appendChild(fragment);
}

// show the cards for 6 seconds when starting/restarting the game.
function startGame() {

	isNotClicked = false;

	for (const card of cards) {
		card.classList.add("open", "show");
	}

	setTimeout(function() {
		for (const card of cards) {
			card.classList.remove("open", "show");

			isNotClicked = true;
		}
	}, 6000);

}


function removeStar() {

	// select the stars
	const stars = document.querySelectorAll(".fa-star");

	if ((movesCounter % 10 === 0) && (stars.length > 1)) { /* each time movesCounter is increased 10 numbers,
	 one star is removed, but if there is only one star left it stops. */
			removedStars.push(stars[0]);
			stars[0].remove();
		}
}


function timer() {
	if (matchedCards.length !== 16) {
		timeContainer.innerHTML = seconds;
		seconds += 1;
		setTimeoutId = setTimeout(timer, 1000);
	}
}


function restart() {

	for (let card of selectCards) {
		card.classList.remove("open", "show", "match");
	}

	// shuffle the cards again
	shuffleCards()

	if (removedStars.length > 0) { // if one or more stars are removed

		const starsContainer = document.querySelector(".stars");
		const eachStarContainer = document.querySelectorAll(".stars li");

		for (let li of eachStarContainer) { // loop over each star's container "li" and append it a star
			if (removedStars.length > 0) { // to avoid running the code if the removedStars list is empty, otherwise, it will through an error.
				li.appendChild(removedStars.pop()); // append a star to each li and remove it from removedStars array.
			}
		}

	}
	// make selectedCards array empty
	selectedCards = [];

	// reset the moves.
	movesCounter = 0; // reset the number of moves to 0.
	moves.innerHTML = movesCounter; // update the number of moves

	// reset and stop the timer.
	seconds = 0;
	timeContainer.innerHTML = seconds;
	clearTimeout(setTimeoutId);

	// hide the congratsPopup
	congratsPopup.classList.remove("visible");

	// make matchedCards array empty
	matchedCards = [];

	// show the cards for 6 seconds
	startGame();

}


function gameEnded() {
	if (matchedCards.length === 16) {

		setTimeout(function() {
			const scoreTime = document.querySelector(".score-time");
			const scoreMoves = document.querySelector(".score-moves");
			const stars = document.querySelectorAll(".fa-star");
			const scoreStarsText = document.querySelector(".score-stars-text");
			const scoreStars = document.querySelector(".score-stars");
			let starsLeft = 0;

			// update the score time
			scoreTime.innerHTML = seconds - 1;

			// update the moves
			scoreMoves.innerHTML = movesCounter;

			// count the left stars
			for (let star of stars) {
				starsLeft += 1;
			}

			// if only one star is left, make sure "star" is displayed and not "stars".
			if (starsLeft === 1) {
				scoreStarsText.innerHTML = "star";
			} else {
				scoreStarsText.innerHTML = "stars";
			}

			// update the stars
			scoreStars.innerHTML = starsLeft;

			// show the popup
			congratsPopup.classList.add("visible");

		}, 850)

	}
}


// container.
const container = document.querySelector(".container");

container.addEventListener("click", function(event) {

	if (event.target.classList.contains("card")) {

		if (selectedCards.length === 1) {

			// to make sure that the player won't select the same card or the card that has the "match"class.
			if ((selectedCards[0] === event.target) || (event.target.classList.contains("match"))) {

				/* https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation */
				event.stopPropagation();

			} else {

				// show the clicked card and its content.
				event.target.classList.add("show", "open");
				// add it to the selectedCards array
				selectedCards.push(event.target);
				// increase the movesCounter
				movesCounter += 1;
				// check if a star should be removed.
				removeStar()

				/* if the selected cards match, then add the class "match" to them and add them to matchedCards array,
				also make the selectedCards array empty.*/
				if (selectedCards[0].innerHTML === selectedCards[1].innerHTML) {

					selectedCards[0].classList.add("match");
					selectedCards[1].classList.add("match");
					matchedCards.push(selectedCards[0], selectedCards[1]);
					selectedCards = [];

				} else { // if the cards don't match, change their colors, hide them again and make the selectedCards array empty.

					selectedCards[0].classList.add("dont-match");
					selectedCards[1].classList.add("dont-match");

					setTimeout(function() {
						selectedCards[0].classList.remove("match", "open", "show", "dont-match");
						selectedCards[1].classList.remove("match", "open", "show", "dont-match");
						selectedCards = [];
					}, 600);

				}
			}
			// check if the user has won the game.
			gameEnded();

		} else if ((selectedCards.length === 2) || (event.target.classList.contains("open", "show")) || (event.target.classList.contains("match"))) {

			/* to make sure that only 2 cards can be displayed at the same time, also when starting the game and
			showing the cards for 6 sec. Plus if the cards already has "match" class.
			https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation */
			event.stopPropagation();

		} else { // when selectedCards array is empty.

			event.target.classList.add("show", "open");
			selectedCards.push(event.target);
			movesCounter += 1;

			// check if a start should be removed.
			removeStar();

			// if this is the first card that is clicked, call the timer function
			if (seconds === 0) {
				timer();
			}
		}

		moves.innerHTML = movesCounter; // update the number of moves

	} else if ((((event.target.classList.contains("restart")) || (event.target.classList.contains("fa-repeat"))) && (event.target.parentNode.classList.contains("restart"))) || (event.target.classList.contains("play-again"))) {

		// && (event.target.parentNode.classList.contains("restart")) -> this condition makes sure that the clicked restart icon is not the one that is inside start popup.

		// check whether restart button is clicked or not.
		if (isNotClicked) {
			restart();
		}

	} else if (event.target.classList.contains("start")) {

		// to avoid running the code when pressing space.
		if (startPopup.classList.contains("visible")) {

			// show the cards for 6 seconds
			startGame();
			// hide popup
			startPopup.classList.remove("visible");
		}
	}

});

// select the cards
const selectCards = document.querySelectorAll(".card");

/* define an array that contains the card because you can't pass a nodeList to shuffle().
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from */
const cards = Array.from(selectCards);

// select the deck of cards
const deck = document.querySelector(".deck");


// To append it the shuffled deck and then append it to .deck
const fragment = document.createDocumentFragment();


// will be used to check whether restart button is clicked or not.
let isNotClicked = true;


// removed stars.
let removedStars = [];


// for timing.
let seconds = 0;
// will be used when stopping the timer.
let setTimeoutId;
const timeContainer = document.querySelector(".time");


// congrats popup
const congratsPopup = document.querySelector(".congrats-popup");


// moves counter
let movesCounter = 0;

// matched cards
let matchedCards = [];

// clicked cards
let selectedCards = [];

// the moves span.
const moves = document.querySelector(".moves");

// show start popup
const startPopup = document.querySelector(".start-popup");
startPopup.classList.add("visible");

// call shuffleCards function
shuffleCards();