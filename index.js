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
                <h2 class= "title button" id="${tank.id}"> ${tank.name} </h2>
              </div>
          `
        })
        section2.firstElementChild.firstElementChild.innerHTML += `
          <a class="button" id="add-tank-button"> add a tank! </a>
        `

        document.getElementById('add-tank-button').addEventListener('click', (event) => {
            section3.innerHTML = `
              <h5 id='create-error'> </h5>
              <br>Tank Section: <input class="input" type="text" id="new-tank-section" >
              <br><br>Tank Name: <input class="input" type="text" id="new-tank-name" >
              <br><br><a class ="button is-small is-primary" id="new-tank-button" > new tank! </a>
            `
            newButton = document.getElementById('new-tank-button')
            newButton.addEventListener('click', createTank)


            function createTank() {
                newName = document.getElementById('new-tank-name').value
                newSection = document.getElementById('new-tank-section').value

                if (newName && newSection) {
                    debugger
                    fetch(`${BASE_URL}tanks`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                          'name': `${newName}`,
                          'section': `${newSection}`
                        })
                    })
                    .then(res => res.json())
                    .then(res => {})
                } else {
                    document.getElementById('create-error').innerText = "name and/or section can't be blank!"
                }
            }
        })



    })
}

function renderSection3(id){

    let deleteButton
    let editButton
    let updateButton

    fetchAndShow()

    function fetchAndShow () {
        fetch(`${BASE_URL}tanks/${id}`)
        .then(res => res.json())
        .then(renderTankInfo)
    }

    function renderTankInfo(resp) {
        let tank = resp
        let fishList = ""

        tank.fish.forEach( fish => {
          fishList += `<a href="#section4" class="button fish-icon" data-id=${fish.id}>${fish.name}</a>`
        })

        section3.innerHTML = `
            <strong>Section: </strong>${tank.section} <br>
            <strong>Name: </strong>${tank.name} <br>
            <strong>Fish: </strong>${fishList} <br><br>
            <a class ="button is-small is-primary" id="edit-tank-button" data-id=${tank.id}>Edit Tank</a><br><br>
            <a class ="button is-small is-primary" id="delete-tank-button" data-id=${tank.id}>Delete Tank</a>
        `
        renderButtons()


        function renderButtons() {
            deleteButton = document.getElementById('delete-tank-button')
            deleteButton.addEventListener('click', deleteTank)
            editButton = document.getElementById('edit-tank-button')
            editButton.addEventListener('click', editTank)
        }


        // future goals:
        // add alert to delete button?
        // no deleting tank if there are fish in tank
        function deleteTank() {
            fetch(`${BASE_URL}tanks/${tank.id}`, {method: 'DELETE'})
            .then(res => res.json())
            .then(res => {
                section3.innerHTML = "Tank is Gone :)"
                document.getElementById(tank.id).remove()
            })
        }

        function editTank() {
            section3.innerHTML = `
              <br>Tank Section: <input class="input" type="text" id="new-tank-section" placeholder="${tank.section}">
              <br><br>Tank Name: <input class="input" type="text" id="new-tank-name" placeholder="${tank.name}">
              <br><a class ="button is-small is-primary" id="update-tank-button" >Save Edits</a>
            `
            updateButton = document.getElementById('update-tank-button')
            updateButton.addEventListener('click', updateTank)
        }

        function updateTank() {
            newTankName = document.getElementById('new-tank-name').value || document.getElementById('new-tank-name').placeholder
            newTankSection = document.getElementById('new-tank-section').value || document.getElementById('new-tank-section').placeholder

            fetch(`${BASE_URL}/tanks/${tank.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'name': `${newTankName}`,
                  'section': `${newTankSection}`
                })
            })
            .then(res => res.json())
            .then(tank => {renderTankInfo(tank); renderSection2(tank.section.toLowerCase())})

        }

    }
}


//render fish show page with update and delete buttons

function renderFishShowPage(id){
    fetch(BASE_URL+ 'fish/' + id)
    .then(res => res.json())
    .then(fish => {
        // section4.style.backgroundColor = "f2fffa"
        section4.innerHTML = `
        <div class= "columns">
        <div class="column">
            <h5 class = 'title is-4'>${fish.name}</h5>
            <p><strong>Species: </strong>${fish.species}</p>
            <p><strong>Health Status: </strong>${fish.health_status}</p>
            <p><strong>Tank: </strong>${fish.tank.name}</p>
        </div>
        <div class="column">
            <a class = "button is-info" id = "update-fish-tank">Update Fish Tank</a><br><br>
            <a class = "button is-link" id= "update-fish-health">Update Fish Health</a>
        </div>
        </div>`


        section4.addEventListener('click', event => {
            //button to update fish tank
            if(event.target.id === "update-fish-tank"){
                updateFishTank(fish.id)
            }

            //button to update fish health
            if(event.target.id === "update-fish-health"){
                updateFishHealth(fish.id)
            }

        })
    })

}


function updateFishTank(fish_id){
    let tankOptions

    fetch(BASE_URL + 'tanks')
    .then(res => res.json())
    .then(tanks => {
        tanks.forEach(tank => {
            tankOptions += `<option value=${tank.id}>${tank.name}</option>`
        })

        // section4.style.backgroundColor = "#f2fffa"
        section4.innerHTML = `
            <div class = columns>
            <div class ="column" >
                <div class="select is-primary">

                <div class="control">
                    <select name= "tank">
                        ${tankOptions}
                    </select><br>
                    <button id= "update-tank-id" class="button is-primary">Update</button>
                    </div>
                    </div>
                </div>
                <div class = "column">
                    <button class="button is-danger is-outlined" id="cancel-update">Cancel</button>
                </div>
            </div>`

        document.getElementById('update-tank-id').addEventListener('click', event => {
            let new_tank_id = document.querySelector('select').value
            //update fish with new tank ID
            fetch(BASE_URL + 'fish/' + fish_id, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({tank_id: new_tank_id})
            })
            .then(res => {
                renderFishShowPage(fish_id)
            })
        })

        document.getElementById('cancel-update').addEventListener('click', event => {
            renderFishShowPage(fish_id)
        })

    })

}

function updateFishHealth(fish_id){
    //add edit form to HTML
   section4.innerHTML +=`
   Fish Health: <input class="input" type="text" id="new-health-status" placeholder="Healthy"></input>
   <br><br>
   <button id= "update-health" class="button is-primary">Update</button>
   `

   // button to submit updates
   document.getElementById('update-health').addEventListener('click', updateHealth)

   function updateHealth(){
       let newHealth = document.getElementById('new-health-status').value
       console.log(newHealth)
       console.log(fish_id)

       fetch(BASE_URL + 'fish/' + fish_id, {
           method: 'PATCH',
           headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
           body: JSON.stringify({health_status: newHealth})
       })
       .then(response=> {
           renderFishShowPage(fish_id)})
   }

}
