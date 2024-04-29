{ // scoping

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






addComment("2031-12-31", "hellooooo");




} // scoping