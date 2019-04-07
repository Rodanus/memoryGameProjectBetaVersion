/*
 * Create a list that holds all of your cards
 */
// select the cards
const selectCards = document.querySelectorAll(".card");
/* define an array that contains the card because you can't pass a nodeList to shuffle().
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from */
const cards = Array.from(selectCards);
// select the deck of cards
const deck = document.querySelector(".deck");
// To append it the shuffled deck and then append it to the .deck, so the browser will do only one reflow and one repaint
const fragment = document.createDocumentFragment();
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

let removedStars = [];
function removeStar() {
	const stars = document.querySelectorAll(".fa-star"); // select the stars
	if ((movesCounter % 10 === 0) && (stars.length > 1)) { /* each time movesCounter is increased 10 numbers,
	 one star is removed, but if there is only one star left it stops. */
			removedStars.push(stars[0]);
			stars[0].remove();
		}
}

let seconds = 0;
let setTimeoutId; // will be use when stopping the timer.
const timeContainer = document.querySelector(".time");
function timer() {
	if (matchedCards.length !== 16) {
		timeContainer.innerHTML = seconds;
		seconds += 1;
		setTimeoutId = setTimeout(timer, 1000);
	}
}

// shuffle the cards
const shuffledDeck = shuffle(cards);
// append the shuffled cards to fragment
for (const card of shuffledDeck) {
	fragment.appendChild(card);
}

// append the cards to .deck
deck.appendChild(fragment);

let movesCounter = 0;
let matchedCards = [];
let selectedCards = [];

const container = document.querySelector(".container"); // the whole container.
const moves = document.querySelector(".moves"); // the moves span.

container.addEventListener("click", function(event) {

	if (event.target.classList.contains("card")) {

		if (selectedCards.length === 1) {

			// to make sure that the player won't select the same card or the card that has the "match"class.
			if ((selectedCards[0] === event.target) || (event.target.classList.contains("match"))) {
				event.stopPropagation(); /* learned from:
				 https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation */

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

				} else { // if the cards don't match, then hide them again and make the selectedCards array empty.
					setTimeout(function() {
						selectedCards[0].classList.remove("match", "open", "show");
						selectedCards[1].classList.remove("match", "open", "show");
						selectedCards = [];
					}, 600);

				}
			}

		} else if (selectedCards.length === 2) {
			/* to make sure that only 2 cards can be displayed at the same time,
			learned from: https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation */
			event.stopPropagation();

		} else if ((event.target.classList.contains("match"))){ // if the clicked card has "match" class
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

	} else if ((event.target.classList.contains("restart")) || (event.target.classList.contains("fa-repeat"))) {

		for (let card of selectCards) {
			card.classList.remove("open", "show", "match");
		}

		if (removedStars.length > 0) { // if one or more stars are removed

			const starsContainer = document.querySelector(".stars");
			const eachStarContainer = document.querySelectorAll(".stars li");

			for (let li of eachStarContainer) { // loop over each star's container "li" and append it a star
				if (removedStars.length > 0) { // to avoid running the code if the removedStars list is empty, otherwise, it will through an error.
					li.appendChild(removedStars.pop()); // append a star to each li and remove it from removedStars array.
				}
			}
			// reset the moves.
			movesCounter = 0; // reset the number of moves to 0.
			moves.innerHTML = movesCounter; // update the number of moves

			// reset and stop the timer.
			seconds = 0;
			timeContainer.innerHTML = seconds;
			clearTimeout(setTimeoutId);
		}
	}

});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
