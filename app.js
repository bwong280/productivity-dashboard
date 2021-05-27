// selectors
const greeting = document.querySelector('.info-items h1');
const dateSection = document.querySelector('.date-section'); 
const weatherIcon = document.querySelector('.weather-icon');
const weatherTemp = document.querySelector('.temperature');
const weatherDesc = document.querySelector('.weather-description');
const weatherNotif = document.querySelector('.weather-notification');

// GREETING DISPLAY
let d = new Date();
let hour = d.getHours(); 
if ((5 <= hour) && (hour < 12)) {
    greeting.innerHTML = '<h1>Good Morning</h1>';
} else if ((12 <= hour) && (hour < 18)) {
    greeting.innerHTML = '<h1>Good Afternoon</h1>';
} else {
    greeting.innerHTML = '<h1>Good Evening</h1>'
}



// DATE DISPLAY 
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let dateString = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; 
dateSection.innerHTML = `<p>${dateString}</p>`


// WEATHER DISPLAY 
const weather = {};
weather.temperature = {
    unit: "celsius"
}

// variables 
const KELVIN = 273; 

// API key
const key = 'e0b3335f1cdbdd6687f30da3fe52d8f6';

// check if browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, setError);
} else {
    weatherNotif.style.display = "block";
    weatherNotif.innerHTML = "<p>Browser doesn't support geolocation.</p>"
}

// set user's position
function setPosition(position) {
    let latitude = position.coords.latitude; 
    let longitude = position.coords.longitude; 

    getWeather(latitude, longitude); 
};

// show error if there is an issue with geolocation service
function setError(error) {
    weatherNotif.style.display = "flex";
    weatherNotif.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <p>Cannot retrieve location data.</p>
    `;
};

// get weather from API 
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response) {
            let data = response.json(); 
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country; 
        })
        .then(function() {
            displayWeather();
        });
}

// display weather to UI
function displayWeather() {
    let gradient = "linear-gradient(to bottom, white 0 50%, rgb(228, 228, 228) 50% 100%)"; 
    weatherIcon.style.background = `url('./images/icons/${weather.iconId}.png') center/90% no-repeat, ${gradient}`;
    weatherTemp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weatherDesc.innerHTML = `${weather.description}`
    // locationElement.innerHTML = `${weather.city}, ${weather.country}`; 
}

// celsius to farenheit conversion
function celsiusToFahrenheit(celsiusTemp) {
    return (celsiusTemp * 9/5) + 32;
}

weatherTemp.addEventListener('click', function() {
    if (weather.temperature.value === undefined) {
        return;
    } else if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value)
        fahrenheit = Math.floor(fahrenheit); 
        weatherTemp.innerHTML = `${fahrenheit}°<span>F</span>`; 
        
        weather.temperature.unit = "fahrenheit"; 
    } else {
        weatherTemp.innerHTML = `${weather.temperature.value}°<span>C</span>`
        weather.temperature.unit = "celsius"; 
    };
});


// TO-DO LIST FUNCTIONALITY 
// selectors
const clear = document.querySelector(".todo-clear");
const list = document.querySelector(".todo-list");
const input = document.querySelector(".todo-input");
const submit = document.querySelector(".todo-button");
const filter = document.querySelector('.filter-todo');

// CSS classes names
const CHECK = "fas fa-check-circle"; 
const UNCHECK = "far fa-circle";
const LINE_THROUGH = "lineThrough";
const STAR = "fas fa-star";
const UNSTAR = "far fa-star";
const PRIORITY = "priority"; 

// Variables
let LIST, id; 

// get todo's from local storage
let data = localStorage.getItem("TODO"); 

// check if data is not empty
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length; 
    loadList(LIST); 
} else {
    LIST = [];
    id = 0;
}

// load items to the UI
function loadList(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.done, item.trash, item.priority); 
    })
}

// clear local storage
clear.addEventListener('click', function() {
    localStorage.clear();
    location.reload(); 
});


// add to do function
function addToDo(todo, id, done, trash, priority) {
    if(trash) {
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const STARRED = priority ? STAR : UNSTAR; 
    const PRIOR = priority ? PRIORITY : ""; 

    const position = 'beforeend';
    const item = `
<li class="item ${PRIOR}">
    <i class="${DONE}" job="complete" id="${id}"></i>
    <p class="${LINE}">${todo}</p>
    <i class="${STARRED}" job="priority" id="${id}"></i>
    <i class="far fa-trash-alt" job="delete" id="${id}"></i>
</li>
                 `
    list.insertAdjacentHTML(position, item)
}

// add an item to the list using the enter key
submit.addEventListener("click", submitToDo);

function submitToDo(event) {
    event.preventDefault(); 
    const todo = input.value;
    if(todo){
        addToDo(todo, id, false, false); 

        LIST.push({
            name: todo,
            id: id,
            done: false,
            trash: false,
            priority: false
        });
        localStorage.setItem('TODO', JSON.stringify(LIST)); 

        id++; 
        }
    
    input.value = ""; 
}


// complete to do
function completeToDo(element) {
    const checkArray = CHECK.split(" "); 
    const uncheckArray = UNCHECK.split(" "); 

    checkArray.forEach(function(item) {
        element.classList.toggle(item);
    });

    uncheckArray.forEach(function(item) {
        element.classList.toggle(item); 
    });

    element.parentNode.querySelector('.item p').classList.toggle(LINE_THROUGH); 

    LIST[element.id].done = LIST[element.id].done ? false : true; 
};

// remove to do
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode); 

    LIST[element.id].trash = true; 
}; 

// set a priority
function priorityToDo(element) {
    const starArray = STAR.split(" "); 
    const unstarArray = UNSTAR.split(" ");
    
    starArray.forEach(function(item) {
        element.classList.toggle(item);
    });

    unstarArray.forEach(function(item) {
        element.classList.toggle(item);
    });

    element.parentNode.classList.toggle(PRIORITY); 

    LIST[element.id].priority = LIST[element.id].priority ? false : true; 
}

// target the items created dynamically 
list.addEventListener('click', deleteCheck);

function deleteCheck(event) {
    const element = event.target; 

    if (element.getAttribute("job")) {
    var elementJob = element.attributes.job.value; // complete or delete
    }

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "delete") {
        removeToDo(element); 
    } else if (elementJob == "priority") {
        priorityToDo(element); 
    }
    localStorage.setItem('TODO', JSON.stringify(LIST)); 
}

// use select element to filter to-do's
filter.addEventListener('change', filterTodo);

function filterTodo(event) {
    const todos = list.childNodes; 

    todos.forEach(function(item) {
    if (item.classList) {
        const completed = item.querySelector("i.fa-check-circle");
        switch (event.target.value) {
            case "all":
                item.style.display = 'list-item';
                break;
            case "completed": 
                if (completed) {
                    item.style.display = 'list-item'; 
                } else {
                    item.style.display = 'none';
                }
                break; 
            case "uncompleted":
                if (!completed) {
                    item.style.display = 'list-item';
                } else {
                    item.style.display = "none"; 
                }
                break; 
            case "priority":
                if (item.classList.contains('priority')) {
                    item.style.display = 'list-item'
                } else {
                    item.style.display = 'none';
                }
                break;   
            }
        }
    }); 
}