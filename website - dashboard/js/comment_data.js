{ // scoping

csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv";

sort_value = "";
year_selection = "";
state_selection = "";

function addComment(date, text){
    // adding the comments to the div in dashboard 
    // (right column in html)
    var div = document.getElementById('dashboard-comments-box');
    var comment = `
        <div class="comment-element">
            <div class="comment-text-box">
                <h3>${date}</h3>
                <p>${text}</p>
            </div>
        </div>
    `;
    div.innerHTML += comment;
}

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index lower than the current index
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function set_year(year){
    year_selection = year;
}

function set_state(state){
    state_selection = state;
}

function set_sort_value(value){
    sort_value = value;
}

function sort_select_table(data){
    
    // select data 
    if (year_selection !== "") {
        data = data.filter(row => row['year'] === year_selection);
    } 
    if (state_selection !== ""){
        data = data.filter(row => row['state'] === state_selection);
    }else{
        data = data;
    }

    // sort the data
    if (sort_value === "random"){
        shuffleArray(data);

    } else if (sort_value === "year"){
        data.sort((a, b) => a['year'] - b['year']);
    } else{
        data = data;
    }
    return data;

}


function createComments(){
    var div = document.getElementById('dashboard-comments-box');

    // del all prev comments
    div.innerHTML = "";

    d3.csv(csvUrl).then(function(raw_data) {
        
        data = sort_select_table(raw_data);


        data = data.length > 10 ? data.slice(0, 50) : data;
        
        for (let i = 0; i < data.length; i++) {
            addComment(data[i]['datetime'], data[i]['comments']);
        }

    }).catch(function(error) {
    console.error("Error loading the CSV file:", error);
    });
}


function comment_init(){
    console.log("comment_init")

    createComments();
}




createComments();




} // scoping