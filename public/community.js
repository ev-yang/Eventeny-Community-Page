/**
 * Evelyn Yang
 * Eventeny Community Page
 * November 25, 2020
 *
 * This is the community.js file for the Eventeny community page.
 * It defines the front-end behavior of the page, allowing the user
 * to interact with buttons and posts.
 */

"use strict";

(function() {

  // Delay before returning to homepage after making new yip.
  const DELAY = 2000;

  window.addEventListener("load", init);

  /**
   * Displays all existing posts and initializes behavior of buttons, search
   * bar, and posts.
   */
  function init() {
    displayPosts();
    id("new-btn").addEventListener("click", showNewPostView);
    id("home-btn").addEventListener("click", showHomeView);
    id("cancel-btn").addEventListener("click", showHomeView);
  }

  async function displayPosts() {
    let posts = formatResults(await getAllPosts());
    for (let post of posts) {
      id("home").appendChild(generateCard(post));
    }
  }

  function getAllPosts() {
    return new Promise( function(resolve) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };
      xhttp.open("GET", "../backend/get_all.php");
      xhttp.send();
    });
  }

  /**
   * Creates display card for a post.
   */
  function generateCard(post) {
    let card = gen("article");
    card.classList.add("card");
    card.id = post["id"];
    let image = postProfilePic(post);
    let contents = postContent(post);
    let info = postInformation(post);
    card.appendChild(image);
    card.appendChild(contents);
    card.appendChild(info);
    return card;
  }

  function postProfilePic(post) {
    let image = gen("img");
    image.src = "img/user.jpg";
    image.alt = "Profile picture for " + post["username"];
    return image;
  }

  function postContent(post) {
    let postContent = gen("div");
    let content = gen("p");
    content.textContent = post["content"];
    content.classList.add("title");
    let individual = gen("p");
    individual.textContent = post["username"];
    postContent.appendChild(content);
    postContent.appendChild(individual);
    return postContent;
  }

  function postInformation(post) {
    let postInfo = gen("div");
    postInfo.classList.add("meta");
    let date = gen("p");
    date.textContent = new Date(post["date"]).toLocaleString();

    // views
    let views = gen("div");
    let eye = gen("img");
    eye.src = "img/eye.png";
    eye.alt = "View icon";
    let numViews = gen("p");
    numViews.textContent = post["views"];
    views.appendChild(eye);
    views.appendChild(numViews);

    // likes
    let likes = gen("div");
    let heart = gen("img");
    heart.src = "img/heart.png";
    heart.alt = "Heart icon";
    // heart.addEventListener("click", likeYip);
    let numLikes = gen("p");
    numLikes.textContent = post["likes"];
    likes.appendChild(heart);
    likes.appendChild(numLikes);

    // follows
    let follows = gen("div");
    let person = gen("img");
    person.src = "img/person.jpg";
    person.alt = "Follow icon";
    let numFollows = gen("p");
    numFollows.textContent = post["follows"];
    follows.appendChild(person);
    follows.appendChild(numFollows);

    postInfo.appendChild(date);
    postInfo.appendChild(views);
    postInfo.appendChild(likes);
    postInfo.appendChild(follows);
    return postInfo;
  }

  /**
   * Show home view
   */
  function showHomeView() {
    id("post").classList.add("hidden");
    id("new").classList.add("hidden");
    id("home").classList.remove("hidden");
  }

  /**
   * Hide current screen, go to new post screen.
   */
  function showNewPostView() {
    id("home").classList.add("hidden");
    id("post").classList.add("hidden");
    id("new").classList.remove("hidden");
  }


  // helper functions
  /**
   * Turns PHP array into JSON array
   */
  function formatResults(arr) {
    let formatter = arr.split(" => ");
    let posts = [];
    for (let i = 1; i < formatter.length - 1; i++) {
      posts.push(JSON.parse(formatter[i].substring(0, formatter[i].length - 3)));
    }
    posts.push(JSON.parse(formatter[formatter.length - 1].substring(0, formatter[formatter.length - 1].length - 2)));
    return posts;
  }

  /**
   * Hides the display, disables all buttons, and shows an error message.
   */
  function handleError(err) {
    id("home").classList.add("hidden");
    id("post").classList.add("hidden");
    id("new").classList.add("hidden");
    id("error").textContent = err;
    id("error").classList.remove("hidden");
    id("search-btn").disabled = true;
    id("home-btn").disabled = true;
    id("new-btn").disabled = true;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first DOM object that matches the given selector.
   * @param {string} selector - query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();
