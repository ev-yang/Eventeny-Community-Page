<?php
// Get database
$db = new SQLite3('community.db');

// Execute SQL
$topic = $_GET["topic"];
$results = $db->query("SELECT id FROM posts WHERE topic LIKE '" . $topic . "%' ORDER BY DATETIME(date) DESC");

if(!$results) {
    echo $db->lastErrorMsg();
} else {
    $posts = array();
    while ($row = $results->fetchArray()) {
        $post_data = array(
            "id" => $row["id"],
        );
        $postJSON = json_encode($post_data);
        array_push($posts, $postJSON);
    }
    return print_r($posts);
}

?>