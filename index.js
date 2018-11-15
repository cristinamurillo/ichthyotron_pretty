const BASE_URL = 'http://localhost:3000/'
const feedingContainer = document.getElementById('feed-button-container')
const section1 = document.getElementById('section1')
const section2 = document.getElementById('section2')
const section3 = document.getElementById('section3')


fetch(BASE_URL + 'feedings/last_meal')
.then(response => response.json())
.then(lastMeal => {
    renderLandingPage(lastMeal)

    // for section1
    const feedButton = document.getElementById('feed-button')
    feedButton.addEventListener('click', createFeeding)


    // for section2
    section2.addEventListener('click', event =>{
        const target = event.target.id
        console.log(target)

        if (target === 'left' || target === 'right' || target === 'back'){
            renderFishroomPage(target)
        } else if (parseInt(target)) {
            renderTankshowPage(target)
        }
    })
})
.catch(error => {
    feedingContainer.innerHTML = "<h6> Connection to Server failed! </h6>"
})



function renderLandingPage(lastMeal) {
      feedingContainer.innerHTML = `
        <h6 class ="subtitle is-4"><strong>Fish Last Fed:</strong> ${lastMeal}</h6>
        <a class ="button is-large is-primary" id="feed-button">Feed Fish</a><br><br>
        <a href = "#section2" class ="button is-large is-primary" id="fish-room-button">Fish Room</a>
      `
}

function createFeeding(event){
  fetch(BASE_URL + 'feedings', {
    method: 'POST'
  })
  .then(res => res.json() )
  .then(lastMeal => renderLandingPage(lastMeal))
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
    tanks.forEach( tank => {
      section2.firstElementChild.firstElementChild.innerHTML += `
          <div class="tile is-child">
            <h2 class= "title button" id= "${tank.id}"> ${tank.name} </h2>
          </div>
      `
    })
  })
}

function renderTankshowPage(id){
    fetch(`${BASE_URL}tanks/${id}`)
    .then(res => res.json())
    .then(tank => {

        let fishList = ""
        tank.fish.forEach( fish => {
            fishList += `<a class="button fish-icon">${fish.name}</a>`
        })

        section3.innerHTML =`
            Section: ${tank.section} <br>
            Name: ${tank.name} <br>
            Fish: ${fishList}
        `
    })
}
