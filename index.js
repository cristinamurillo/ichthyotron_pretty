const BASE_URL = 'http://localhost:3000/'
const feedingContainer = document.getElementById('feed-button-container')
const section1 = document.getElementById('section1')
const section2 = document.getElementById('section2')
const section3 = document.getElementById('section3')
const section4 = document.getElementById('section4')

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

    //for section3
    section3.addEventListener('click', event => {
        if(parseInt(event.target.dataset.id)){
            renderFishShowPage(event.target.dataset.id)
        }
    })
   //for section 4
   section4.addEventListener('click', event => {

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

        // render sec2 innerHTML for tank section view
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
        let deleteButton
        let editButton
        let updateButton

        // create list of Fish
        tank.fish.forEach( fish => {
            fishList += `<a href="#section4" class="button fish-icon" data-id=${fish.id}>${fish.name}</a>`
        })

        // fill in section3 with tank info and fishList
        section3.innerHTML = `
            Section: ${tank.section} <br>
            Name: ${tank.name} <br>
            Fish: ${fishList} <br>
            <a class ="button is-small is-primary" id="edit-tank-button" data-id=${tank.id}>Edit Tank</a><br>
            <a class ="button is-small is-primary" id="delete-tank-button" data-id=${tank.id}>Delete Tank</a>
        `

        // buttons
        deleteButton = document.getElementById('delete-tank-button')
        deleteButton.addEventListener('click', deleteTank)

        editButton = document.getElementById('edit-tank-button')
        editButton.addEventListener('click', editTank)


        function deleteTank(){
            fetch(`${BASE_URL}tanks/${tank.id}`, {method: 'DELETE'})
            .then(res => res.json())
            .then(res => {
                section3.innerHTML = "Tank is Gone :)"
                document.getElementById(tank.id).remove()
            })
        }

        function editTank(event){

            // add edit form to HTML
            section3.innerHTML += `
              <br>Tank: <input class="input" type="text" id="new-tank-name" placeholder="${tank.name}">
              <br>Section: <input class="input" type="text" id="new-tank-section" placeholder="${tank.section}">
              <a class ="button is-small is-primary" id="update-tank-button" data-id=${tank.id}>Submit Updates</a>
            `

            // button to submit updates
            updateButton = document.getElementById('update-tank-button')
            updateButton.addEventListener('click', update)


            function update(){
                newTankName = document.getElementById('new-tank-name').value || document.getElementById('new-tank-name').placeholder
                newTankSection = document.getElementById('new-tank-section').value || document.getElementById('new-tank-section').placeholder

                const updates = {
                  'name': `${newTankName}`,
                  'section': `${newTankSection}`
                }

                fetch(`${BASE_URL}/tanks/${tank.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updates)
                })
                .then(renderUpdates)

                function renderUpdates(){
                    
                }

            }

        }

    })
}


//render fish show page with update and delete buttons

function renderFishShowPage(id){
    fetch(BASE_URL+ 'fish/' + id)
    .then(res => res.json())
    .then(fish => {
        section4.innerHTML = `
        <div class= "columns">
        <div class="column">
            <h5 class = 'title is-4'>${fish.name}</h5>
            <p><strong>Species: </strong>${fish.species}</p>
            <p><strong>Tank: </strong>${fish.tank.name}</p>
        </div>
        <div class="column">
            <a class = "button is-info" id = "update-fish-tank">Update Fish Tank</a><br><br>
            <a class = "button is-link" id= "update-fish-health">Update Fish Health</a>
        </div>
        </div>`
    })

}
