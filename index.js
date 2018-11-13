const BASE_URL = 'http://localhost:3000/'
const feedingContainer = document.getElementById('feed-button-container')


fetch(BASE_URL + 'feedings/last_meal')
.then(response => response.json())
.then(lastMeal => {
  renderLandingPage(lastMeal)
  const feedButton = document.getElementById('feed-button')
  feedButton.addEventListener('click', createFeeding)
  const fishRoomButton = document.getElementById('fish-room-button')
  fishRoomButton.addEventListener('click', renderFishroomPage)

})
.catch(error => {
  feedingContainer.innerHTML = "<h6> Connection to Server failed! </h6>"
})



function renderLandingPage(lastMeal) {
  feedingContainer.innerHTML = `
    <h6>Fish Last Fed: ${lastMeal}</h6>
    <a class ="button is-large is-primary" id="feed-button">Feed Fish</a>
    <a class ="button is-large is-primary" id="fish-room-button">Fish Room</a>
  `
}

function createFeeding(event){
  fetch(BASE_URL + 'feedings', {
    method: 'POST'
  })
  .then(res=>{
    RenderFishFed()
  })
  .catch(error => {debugger})

}

function renderFishroomPage(){

}
