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
    id("cancel-btn").addEventListener("click", function(event) {
      event.preventDefault();
      showHomeView();
    });
    id("post-btn").addEventListener("click", function(event) {
      event.preventDefault();
      newPost();
    });
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
        if (this.readyState === 4 && this.status === 200) {
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

    // topic
    let topic = gen("p");
    topic.textContent = post["topic"];
    topic.classList.add("topic");

    // title
    let title = gen("h2");
    title.textContent = post["title"];
    title.classList.add("title");
    title.addEventListener("click", showPostView);

    // username
    let individual = gen("p");
    individual.textContent = post["username"];

    // content
    let content = gen("p");
    content.textContent = post["content"];
    content.classList.add("content");
    content.classList.add("hidden");

    postContent.appendChild(topic);
    postContent.appendChild(title);
    postContent.appendChild(individual);
    postContent.appendChild(content);
    return postContent;
  }

  function postInformation(post) {
    let postInfo = gen("div");
    postInfo.classList.add("trackers");
    let date = gen("p");
    date.textContent = new Date(post["date"]).toLocaleString();

    // views
    let views = gen("div");
    views.classList.add("views");
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
    heart.addEventListener("click", function() {
      incrementStats(likes, "likes");
    });
    let numLikes = gen("p");
    numLikes.textContent = post["likes"];
    likes.appendChild(heart);
    likes.appendChild(numLikes);

    // follows
    let follows = gen("div");
    let person = gen("img");
    person.src = "img/person.jpg";
    person.alt = "Follow icon";
    person.addEventListener("click", function() {
      incrementStats(follows, "follows");
    });
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
   * Show home view.
   */
  function showHomeView() {
    id("comments").innerHTML = "";
    id("comments").classList.add("hidden");
    id("new").classList.add("hidden");
    id("name").value = "";
    id("post-title").value = "";
    id("post-content").value = "";
    let topics = document.getElementsByName("topic");
    for (let option of topics) {
      option.checked = false;
    }
    let posts = qsa(".card");
    for (let post of posts) {
      post.classList.remove("hidden");
      post.querySelector(".content").classList.add("hidden");
    }
    id("home").classList.remove("hidden");
  }

  /**
   * Show new post screen.
   */
  function showNewPostView() {
    id("home").classList.add("hidden");
    id("comments").innerHTML = "";
    id("comments").classList.add("hidden");
    id("new").classList.remove("hidden");
  }

  /**
   * Show individual post and all of its comments.
   */
  function showPostView() {
    // hide everything except clicked post
    let posts = qsa(".card");
    for (let post of posts) {
      if (post.id !== this.parentElement.parentElement.id) {
        post.parentElement.parentElement.querySelector(".content").classList.add("hidden");
        post.classList.add("hidden");
      }
    }
    this.parentElement.parentElement.querySelector(".content").classList.remove("hidden");

    // increment views
    let viewCounter = this.parentElement.parentElement.querySelector(".views");
    incrementStats(viewCounter, "views");

    // display comments
    // TODO: get comments from database
    id("comments").classList.remove("hidden");
  }

  /**
   * Submit a new post. After a delay of 2 seconds, return to homepage.
   */
  async function newPost() {
    let newPost = formatResults(await submitPost())[0];
    id("home").prepend(generateCard(newPost));
    setTimeout(showHomeView, 2000);
  }

  /**
   * Add new post to database
   */
  function submitPost() {
    // add to database
    return new Promise( function(resolve) {
      // Create object and set up request
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.responseText);
        }
      };

      // Get new post information, build query string
      let topics = document.getElementsByName("topic");
      let topic = "";
      for (let option of topics) {
        if (option.checked) {
          topic = option.value;
          break;
        }
      }
      let queryString = "username=" + id("name").value +
          "&title=" + id("post-title").value +
          "&content=" + id("post-content").value +
          "&topic=" + topic;

      // Pass query information into server script for POST request
      xhttp.open("POST", "../backend/new_post.php", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(queryString);
    });
  }

  /**
   * Increment the given stats on the post by one.
   * @param {object} container - DOM object holding all stats
   * @param {String} type - whether we are incrementing likes or follows
   */
  function incrementStats(container, type) {
    // Increment text on page
    let current = parseInt(container.querySelector("p").textContent);
    let updated = (current + 1).toString();
    container.querySelector("p").textContent = updated;

    // Create object and set up request
    let xhttp = new XMLHttpRequest();
    let queryString = "type=" + type +
        "&updated=" + updated +
        "&id=" + container.parentElement.parentElement.id;

    // Pass query information into server script for POST request
    xhttp.open("POST", "../backend/increment_stats.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(queryString);
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
