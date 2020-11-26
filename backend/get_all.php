<?php
// Create database
$db = new SQLite3('community.db');


// Create table
$db->exec("CREATE TABLE IF NOT EXISTS posts (
    id INTEGER,
    username TEXT,
    content TEXT,
    comments INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    follows INTEGER DEFAULT 0,
    date DATETIME DEFAULT (datetime('now', 'localtime')),
    PRIMARY KEY('id' AUTOINCREMENT)
)");

// Execute SQL
$results = $db->query("SELECT * FROM posts ORDER BY DATETIME(date) DESC");

if(!$results) {
    echo $db->lastErrorMsg();
} else {
    $posts = array();
    while ($row = $results->fetchArray()) {
      $post_data = array(
          "id" => $row["id"],
          "username" => $row["username"],
          "content" => $row["content"],
          "comments" => $row["comments"],
          "views" => $row["views"],
          "likes" => $row["likes"],
          "follows" => $row["follows"],
          "date" => $row["date"]
      );
      $postJSON = json_encode($post_data);
      array_push($posts, $postJSON);
    }
    return print_r($posts);
}

?>