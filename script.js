// get the elemets we're going to modified
const NAVBAR = document.querySelector("nav");
const MENUICON = document.querySelector("#menu-icon");
const MAIN = document.querySelector("main");
const POSTS = document.querySelector("#posts");
const ADDBUTTON = document.querySelector("#add-post");
const POSTFIELD = document.querySelector("#post-field");
const TITLEFIELD = document.querySelector("#post-title");
const TEXTFIELD = document.querySelector("#post-text");
const DATEFIELD = document.querySelector("#post-date");
const LINKSLIST = document.querySelector("#links");
const TOPBUTTON = document.querySelector("#to-top")

// load old posts that are saved in the local storage from newest to oldest
// then add links to them in the nav bar
let storageKey = 0;
while (localStorage.getItem(storageKey) != null) {
    let stored = localStorage.getItem(storageKey);
    // create a new article element, change it's inner HTML to the one saved
    // and then add it at the top of the posts section 
    let post = document.createElement("article");
    post.innerHTML = stored;
    POSTS.insertBefore(post, POSTS.firstChild);
    // create  a list item with the post's header and link to it
    // then add it to the nav bar
    let link = document.createElement("a");
    link.textContent = stored.substring(stored.indexOf(">") + 1, stored.indexOf("</h2>"));
    link.href = `#postId=${storageKey}`;
    link.id = `linkId=${storageKey}`
    LINKSLIST.insertBefore(link, LINKSLIST.firstChild);
    // increment the storage key to go to the next item in the local storage
    storageKey++;
}

// get the orginal postion of the main section
let mainLeft = window.getComputedStyle(MAIN).left;
let mainWidth = window.getComputedStyle(MAIN).width;
// hide/show the nav bar and adjust the main section's position to fit the screen
MENUICON.addEventListener("click", function() {
    if (window.getComputedStyle(NAVBAR).visibility === "hidden") {
        NAVBAR.style.visibility = "visible";
        MAIN.style.left = mainLeft;
        MAIN.style.width = mainWidth;
        MENUICON.setAttribute("src", "close_icon.png");   
    } else {
        NAVBAR.style.visibility = "hidden";
        MAIN.style.left = "0px";
        MAIN.style.width = "98%";
        MENUICON.setAttribute("src", "menu_icon.png");
    }  
});

// hide the nav bar when we scroll and show/hide the scroll up button
MAIN.addEventListener("scroll", function() {
    NAVBAR.style.visibility = "hidden";
    MAIN.style.left = "0px";
    MAIN.style.width = "98%";
    MENUICON.setAttribute("src", "menu_icon.png");
    
    if (MAIN.scrollTop > 300) {
        TOPBUTTON.style.display = "block";
    }
    else {
        TOPBUTTON.style.display = "none";
    }
    let windowTop = $(this).scrollTop();

    // highlight post in view and it's link in the nav bar
    let posts = document.querySelectorAll("article");
    // once we scroll we run this for every post

    posts.forEach(function(element) {
        // get the innerHTML of the post to extract post id from
        let string = element.innerHTML;
        let id = string.substring(string.indexOf("Id=") + 3, string.indexOf(">") - 1);
        // if the element is in view, make its class active
        if (element.getBoundingClientRect().top > 150 && element.getBoundingClientRect().bottom < 800) {
            element.setAttribute("class", "active");
            document.getElementById(`linkId=${id}`).setAttribute("class", "active");
        } 
        // otherwise, not active
        else {
            element.removeAttribute("class");
            document.getElementById(`linkId=${id}`).removeAttribute("class");
        };
    });
});

// scroll up when the button is clicked
TOPBUTTON.addEventListener("click", function() {
    MAIN.scrollTop = 0;
});

// change the date in the post filed to be today's date
if (DATEFIELD.value == "") {
    DATEFIELD.value = new Date().toISOString().split("T")[0];
};

// add post 
ADDBUTTON.addEventListener("click", function() {
    // refuse to post if the field are empty
    if (TEXTFIELD.value == "" || TITLEFIELD.value == "") {
        if (TEXTFIELD.value == "") {
            TEXTFIELD.style.backgroundColor = "rgb(251, 80, 80)";
        }
        if (TITLEFIELD.value == "") {
            TITLEFIELD.style.backgroundColor = "rgb(251, 80, 80)";
        }
    } else {
        // create a new articale element and add the filed's content to it
        let newPost = document.createElement("article");
        let title = document.createElement("h2");
        title.textContent = TITLEFIELD.value;
        title.id = `postId=${storageKey}`;
        newPost.appendChild(title);
        let post = document.createElement("p");
        post.textContent = DATEFIELD.value + "\n" + TEXTFIELD.value;
        newPost.appendChild(post);
        // then add it to the top of the posts
        POSTS.insertBefore(newPost, POSTS.firstChild);
        // store the post in the local storage
        localStorage.setItem(storageKey, newPost.innerHTML);
        storageKey++;
        //empty the feilds
        TITLEFIELD.value = "";
        TEXTFIELD.value = "";
    }
});
