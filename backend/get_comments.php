<?php
// Get database
$db = new SQLite3('community.db');

// Create table
$db->exec("CREATE TABLE IF NOT EXISTS comments (
    id INTEGER,
    parent_id INTEGER,
    username TEXT,
    content TEXT,
    date DATETIME DEFAULT (datetime('now', 'localtime')),
    PRIMARY KEY('id' AUTOINCREMENT)
)");

// Execute SQL
$id = $_GET["id"];
$results = $db->query("SELECT * FROM comments WHERE parent_id='" . $id . "' ORDER BY DATETIME(date) DESC");

if(!$results) {
    echo $db->lastErrorMsg();
} else {
    $posts = array();
    while ($row = $results->fetchArray()) {
        $post_data = array(
            "id" => $row["id"],
            "username" => $row["username"],
            "content" => $row["content"],
            "date" => $row["date"]
        );
        $postJSON = json_encode($post_data);
        array_push($posts, $postJSON);
    }
    return print_r($posts);
}

?>