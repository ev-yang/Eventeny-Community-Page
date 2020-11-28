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
    id("search-term").addEventListener("input", enableSearch);
    id("topic-btn").addEventListener("click", filterByTopic);
    id("comment-btn").addEventListener("click", newComment);
    id("flag-btn").addEventListener("click", flagPost);
  }

  /**
   * Gets all posts and displays them on the homepage.
   */
  async function displayPosts() {
    let posts = formatResults(await getAllPosts());
    for (let post of posts) {
      id("home").appendChild(generateCard(post));
    }
  }

  /**
   * Gets all posts from database.
   * @return {Promise} Unformatted array of all posts.
   */
  function getAllPosts() {
    return new Promise( function(resolve) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.responseText);
        }
      };
      xhttp.open("GET", "../backend/get_all.php", true);
      xhttp.send();
    });
  }

  /**
   * Creates display card for a post.
   * @param {object} post - JSON of post information.
   * @return {object} DOM object of the display card.
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

  /**
   * Creates profile image part of the post card.
   * @param {object} post - JSON of post information.
   * @return {object} DOM object of profile image.
   */
  function postProfilePic(post) {
    let image = gen("img");
    image.src = "img/user.jpg";
    image.alt = "Profile picture for " + post["username"];
    return image;
  }

  /**
   * Creates topic, title, and content parts of the post card.
   * @param {object} post - JSON of post information.
   * @return {object} DOM object of post topic, title, and content.
   */
  function postContent(post) {
    let postContent = gen("div");

    // topic
    let topic = gen("p");
    topic.textContent = post["topic"];
    topic.classList.add("topic");

    // title
    let title = gen("span");
    title.textContent = post["title"];
    title.classList.add("title");
    title.addEventListener("click", showPostView);

    // username
    let individual = gen("span");
    individual.textContent = post["username"];
    individual.classList.add("username");
    title.appendChild(individual);

    // title and username
    let heading = gen("h2");
    heading.classList.add("heading");
    heading.appendChild(title);
    heading.appendChild(individual);

    // content
    let content = gen("p");
    content.textContent = post["content"];
    content.classList.add("content");
    content.classList.add("hidden");

    postContent.appendChild(topic);
    postContent.appendChild(heading);
    postContent.appendChild(content);
    return postContent;
  }

  /**
   * Creates post date and stats trackers.
   * @param {object} post - JSON of post information.
   * @return {object} DOM object of post date and trackers.
   */
  function postInformation(post) {
    let postInfo = gen("div");
    postInfo.classList.add("trackers");
    let date = gen("p");
    date.textContent = new Date(post["date"]).toDateString();

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
   * Show homepage with all posts.
   */
  function showHomeView() {
    id("search-term").value = "";
    id("post-comments").innerHTML = "";
    id("comments").classList.add("hidden");
    id("new").classList.add("hidden");
    id("name").value = "";
    id("new-comment").value = "";
    id("comment-username").value = "";
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
    id("search-term").value = "";
    id("home").classList.add("hidden");
    id("post-comments").innerHTML = "";
    id("new-comment").value = "";
    id("comment-username").value = "";
    id("comments").classList.add("hidden");
    id("new").classList.remove("hidden");
  }

  /**
   * Show individual post and all of its comments.
   */
  async function showPostView() {
    // hide everything except clicked post
    let thisPost = this.parentElement.parentElement.parentElement;
    id("post-comments").innerHTML = "";
    id("search-term").value = "";
    id("new-comment").value = "";
    id("comment-username").value = "";
    let posts = qsa(".card");
    for (let post of posts) {
      if (post.id !== thisPost.id) {
        post.parentElement.parentElement.querySelector(".content").classList.add("hidden");
        post.classList.add("hidden");
      }
    }
    thisPost.querySelector(".content").classList.remove("hidden");

    // increment views
    let viewCounter = thisPost.querySelector(".views");
    incrementStats(viewCounter, "views");

    // display comments
    let comments = formatResults(await getComments(thisPost.id));
    for (let comment of comments) {
      let newComment = generateComment(comment);
      id("post-comments").appendChild(newComment);
    }
    id("comments").classList.remove("hidden");
  }

  /**
   * Gets all comments for the post with the given ID.
   * @param {int} id - ID of the parent post.
   * @returns {Promise} Array of comment information.
   */
  async function getComments(id) {
    return new Promise( function(resolve) {
      // Create object and set up request
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

      // Pass query information into server script for GET request
      let queryString = "?id=" + id;
      xhttp.open("GET", "../backend/get_comments.php" + queryString, true);
      xhttp.send();
    });
  }

  /**
   * Adds a new comment under the current post.
   */
  async function newComment() {
    if (id("comment-username").value.trim() !== "" && id("new-comment").value.trim() !== "") {
      let newComment = formatResults(await addComment())[0];
      console.log(newComment);
      id("post-comments").prepend(generateComment(newComment));
      id("new-comment").value = "";
      id("comment-username").value = "";
    }
  }

  /**
   * Add new comment to database.
   * @returns {Promise} Array of new comment information.
   */
  function addComment() {
    return new Promise( function(resolve) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.responseText);
        }
      };

      // Get new comment information, build query string
      let parentID = getCurrentPost().id;
      let username = id("comment-username").value;
      let comment = id("new-comment").value;
      let queryString = "id=" + parentID + "&username=" + username + "&content=" + comment;

      // Pass query information into server script for POST request
      xhttp.open("POST", "../backend/new_comment.php", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(queryString);
    });
  }

  /**
   * Creates display card for the given comment.
   * @param {object[]} comment - JSON array of comment information.
   * @returns {object} DOM object for the new comment card.
   */
  function generateComment(comment) {
    let card = gen("article");
    card.classList.add("comment");
    card.id = comment["id"];

    // Username
    let username = gen("h2");
    username.textContent = comment["username"];

    // Content
    let content = gen("p");
    content.textContent = comment["content"];

    // Date
    let date = gen("p");
    date.classList.add("date");
    date.textContent = new Date(comment["date"]).toDateString();

    card.appendChild(username);
    card.appendChild(content);
    card.appendChild(date);
    return card;
  }

  /**
   * If all fields are non-empty, submit a new post. After a delay of
   * 2 seconds, return to homepage.
   */
  async function newPost() {
    let topics = document.getElementsByName("topic");
    let topic = "";
    for (let option of topics) {
      if (option.checked) {
        topic = option.value;
        break;
      }
    }
    let name = id("name").value.trim();
    let title = id("post-title").value.trim();
    let content = id("post-content").value.trim();
    if (topic !== "" && name !== "" && title !== "" && content !== "") {
      let newPost = formatResults(await addPost(topic, name, title, content))[0];
      id("home").prepend(generateCard(newPost));
      id("new").classList.add("submitted-form");
      setTimeout(() => {
        showHomeView();
        id("new").classList.remove("submitted-form");
      }, DELAY);
    }
  }

  /**
   * Adds a new post with the given information to the database.
   * @param {String} topic - Topic of the new post.
   * @param {String} name - Name of the user making the new post.
   * @param {String} title - Title of the new post.
   * @param {String} content - Content of the new post.
   * @returns {Promise} Array of new post information.
   */
  function addPost(topic, name, title, content) {
    return new Promise( function(resolve) {
      // Create object and set up request
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.responseText);
        }
      };

      // Build query string
      let queryString = "username=" + name +
          "&title=" + title +
          "&content=" + content +
          "&topic=" + topic;

      // Pass query information into server script for POST request
      xhttp.open("POST", "../backend/new_post.php", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(queryString);
    });
  }

  /**
   * Increment the given type of stats (likes or follows) on the post by one.
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

  /**
   * Filters through posts based on the selected topic(s) and displays the
   * matching posts.
   */
  async function filterByTopic() {
    // Get selected topic(s)
    let selectedTopics = [];
    let topics = qsa("#topic-filter input");
    for (let topic of topics) {
      if (topic.checked) selectedTopics.push(topic.value);
    }

    // Get ids of posts from database for each topic and display results
    let results = [];
    for (let topic of selectedTopics) {
      let matches = formatResults(await getTopic(topic));
      results = results.concat(matches);
    }
    displaySearchResults(results);
  }

  /**
   * Gets IDs of posts matching the given topic.
   * @param {String} topic - Topic of post to look for.
   * @returns {Promise} Array of JSON of IDs of posts matching the  given topic.
   */
  function getTopic(topic) {
    return new Promise( function(resolve) {
      // Create object and set up request
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

      // Pass query information into server script for GET request
      let queryString = "?topic=" + topic;
      xhttp.open("GET", "../backend/filter_topic.php" + queryString, true);
      xhttp.send();
    });
  }

  /**
   * Enables search button if there is something in the search bar apart
   * from white space.
   */
  function enableSearch() {
    if (id("search-term").value.trim() !== "") {
      id("search-btn").disabled = false;
      id("search-btn").addEventListener("click", searchPosts);
    } else {
      id("search-btn").disabled = true;
    }
  }

  /**
   * Search through posts for the term in the search bar. Displays posts
   * matching the search term and hides everything else.
   */
  async function searchPosts() {
    let searchTerm = id("search-term").value.trim();
    showHomeView();
    let results = formatResults(await getSearchResults(searchTerm));
    displaySearchResults(results);
  }

  /**
   * Gets IDs of posts matching the given search term.
   * @param {String} term - Search term.
   * @returns {Promise} Array of JSON of IDs matching the given search term.
   */
  function getSearchResults(term) {
    return new Promise( function(resolve) {
      // Create object and set up request
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

      // Pass query information into server script for GET request
      let queryString = "?term=" + term;
      xhttp.open("GET", "../backend/search.php" + queryString, true);
      xhttp.send();
    });
  }

  /**
   * Displays the posts with the given IDs.
   * @param {object[]} results - JSON array of post IDs.
   */
  function displaySearchResults(results) {
    let wanted = [];
    for (let result of results) {
      wanted.push(result["id"].toString());
    }
    let allPosts = qsa(".card");
    for (let post of allPosts) {
      if (wanted.length === 0 || !wanted.includes(post.id)) {
        post.classList.add("hidden");
      } else {
        post.classList.remove("hidden");
      }
    }
  }

  /**
   * Mark a post as flagged and display a success message for 2 seconds.
   */
  function flagPost() {
    let flagged = getCurrentPost();
    processFlag(flagged);
    id("flag-message").classList.remove("hidden");
    setTimeout(() => {
      id("flag-message").classList.add("hidden");
    }, DELAY);
  }

  /**
   * Add flagged post to database.
   * @param {object} post - JSON of post information.
   */
  function processFlag(post) {
    // get post information and build query string
    let id = post.id;
    let title = post.querySelector(".title").textContent;
    let content = post.querySelector(".content").textContent;
    let queryString = "id=" + id +
      "&title=" + title +
      "&content=" + content;

    // insert into database
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "../backend/flag_post.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(queryString);
  }

  /**
   * Gets current post being displayed.
   * @returns {object} - DOM object of post being displayed.
   */
  function getCurrentPost() {
    let current;
    let posts = qsa(".card");
    for (let post of posts) {
      if (!post.classList.contains("hidden")) {
        current = post;
        break;
      }
    }
    return current;
  }

  /**
   * Turns PHP array into JSON array.
   * @param {String} arr - Original unformatted array.
   * @return {object[]} Formatted JSON array.
   */
  function formatResults(arr) {
    let formatter = arr.split(" => ");
    let posts = [];
    if (formatter.length <= 1) {
      return posts;
    }
    for (let i = 1; i < formatter.length - 1; i++) {
      posts.push(JSON.parse(formatter[i].substring(0, formatter[i].length - 3)));
    }
    posts.push(JSON.parse(formatter[formatter.length - 1]
      .substring(0, formatter[formatter.length - 1].length - 2)));
    return posts;
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