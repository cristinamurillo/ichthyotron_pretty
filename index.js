const BASE_URL = 'http://localhost:3000/'
const feedingContainer = document.getElementById('feed-button-container')
const section1 = document.getElementById('section1')
const section2 = document.getElementById('section2')
const section3 = document.getElementById('section3')


fetch(BASE_URL + 'feedings/last_meal')
.then(response => response.json())
.then(lastMeal => {
    renderSection1(lastMeal)

    // for section1
    const feedButton = document.getElementById('feed-button')
    feedButton.addEventListener('click', createFeeding)


    // for section2
    section2.addEventListener('click', event =>{
        const target = event.target.id
        console.log(target)

        if (target === 'left' || target === 'right' || target === 'back'){
            renderSection2(target)
        } else if (parseInt(target)) {
            renderSection3(target)
        }
    })
})
.catch(error => {
    feedingContainer.innerHTML = "<h6> Connection to Server failed! </h6>"
})



function renderSection1(lastMeal) {
    feedingContainer.innerHTML = `
    <h6 class ="subtitle is-4" id="last-fed-display"> </h6>
    <a class ="button is-large is-primary" id="feed-button">Feed Fish</a><br><br>
    <a href = "#section2" class ="button is-large is-primary" id="fish-room-button">Fish Room</a>
    `
    updateLastFed(lastMeal)
}

function updateLastFed(lastMeal){
    document.getElementById('last-fed-display').innerHTML = `
      <strong>Fish Last Fed:</strong> ${lastMeal}
    `
}

function createFeeding(event){
  fetch(BASE_URL + 'feedings', {method: 'POST'})
  .then(res => res.json() )
  .then(updateLastFed)
}

function renderSection2(sectionName){
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

function renderSection3(id){
    fetch(`${BASE_URL}tanks/${id}`)
    .then(res => res.json())
    .then(tank => {
        let fishList = ""
        const tankId = tank.id

        tank.fish.forEach( fish => {
            fishList += `<li>${fish.name}</li>`
        })
        section3.innerHTML =`
            Section: ${tank.section} <br>
            Name: ${tank.name} <br>
            Fish: ${fishList}
            <a class ="button is-small is-primary" id="delete-tank-button" data-id=${tank.id}>Delete Tank</a>
        `
        document.getElementById('delete-tank-button').addEventListener('click', deleteTank)

        function deleteTank(event){
            // debugger
            fetch(`${BASE_URL}tanks/${event.target.dataset.id}`, {method: 'DELETE'})
            section3.innerHTML = "Tank is Gone :)"
            document.getElementById(event.target.dataset.id).remove()
            // debugger
        }


    })
}
