/*
 * Create a list that holds all of your cards
 */
// select the cards
const selectCards = document.querySelectorAll(".card");
// define an array that contains the card because you can't pass a nodeList to shuffle(). https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
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

const shuffledDeck = shuffle(cards);
// append the shuffled cards to fragment
for (const card of shuffledDeck) {
	fragment.appendChild(card);
}
// append the cards to .deck
deck.appendChild(fragment);

let selectedCards = [];
const container = document.querySelector(".container");
container.addEventListener("click", function(event) {

	if (event.target.classList.contains("card")) {

		if (selectedCards.length === 1) {

			// show the clicked card and its content.
			event.target.classList.add("show", "open");
			// add it to the selectedCards array
			selectedCards.push(event.target);
			// if the selected cards match, then add the class "match" to them and make the selectedCards array empty.
			if (selectedCards[0].innerHTML === selectedCards[1].innerHTML) {
				
				selectedCards[0].classList.add("match");
				selectedCards[1].classList.add("match");
				selectedCards = [];

			} else { // if the cards don't match, then hide them again and make the selectedCards array empty.
				setTimeout(function() {
					selectedCards[0].classList.remove("match", "open", "show");
					selectedCards[1].classList.remove("match", "open", "show");
					selectedCards = [];
				}, 600);
				
			}

		} else if (selectedCards.length === 2) {
				// to make sure that only 2 cards can be displayed at the same time, learned from: https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
				event.stopPropagation(); 

		} else { // when no card is clicked.
			event.target.classList.add("show", "open");
			selectedCards.push(event.target);
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
