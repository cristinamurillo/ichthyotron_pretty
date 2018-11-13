const feedButton = document.getElementById('feed-button')

const BASE_URL = 'http://localhost:3000/'

fetch(BASE_URL + 'feedings/last_meal')
.then(response => response.json())
.then(lastMeal => {
    const feedingContainer = document.getElementById('feed-button-container')
    feedingContainer.innerHTML = `<h6>Fish Last Fed: ${lastMeal}</h6>
    <a class ="button is-large is-primary" id="feed-button">Feed Fish</a>`
    // let h6 = document.createElement('h6')
    // h6.innerText = `Fish Last Fed: ${lastMeal}`
    // feedingContainer.appendChild(h6)
})