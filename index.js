const BASE_URL = 'http://localhost:3000/'
const feedingContainer = document.getElementById('feed-button-container')
const section1 = document.getElementById('section1')
const section2 = document.getElementById('section2')

fetch(BASE_URL + 'feedings/last_meal')
.then(response => response.json())
.then(lastMeal => {
  renderLandingPage(lastMeal)

  // for section1
  const feedButton = document.getElementById('feed-button')
  feedButton.addEventListener('click', createFeeding)
  const fishRoomButton = document.getElementById('fish-room-button')
  fishRoomButton.addEventListener('click', renderFishroomPage)

  // for section2
  section2.addEventListener('click', event =>{
    const target = event.target.id
    if (target === 'left'){
      // section2.innerHTML =
    } else if (target === 'right'){
      renderFishroomPage(target)
      // section2.innerHTML =
    } else if (target === 'back'){
      // section2.innerHTML =
    }
  })

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

function renderFishroomPage(sectionName){
  fetch(`${BASE_URL}tanks/section/${sectionName}`)
  .then(res => res.json())
  .then(tanks => {

    section2.innerHTML = `
      <div class="tile is-ancestor">
        <div class="tile is-parent" >
        </div>
      </div>
    `

    // debugger

    tanks.forEach( tank => {

      section2.firstElementChild.firstElementChild.innerHTML += `

          <div class="tile is-child box" id= "left">
            <h2 class= "title"> ${tank.name} </h2>
          </div>


      `
    })
  })


}
