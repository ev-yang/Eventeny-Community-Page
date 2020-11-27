<?php
// Get database
$db = new SQLite3('community.db');

// Prepare and bind
$stmt = $db->prepare("INSERT INTO comments (parent_id, username, content) VALUES (:id, :username, :content)");
if (!$stmt) {
    echo $db->lastErrorMsg();
}
$stmt->bindParam(':id', $id);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':content', $content);

// Set parameters and execute
$id = $_POST["id"];
$username = $_POST["username"];
$content = $_POST["content"];
$stmt->execute();

// Get added post
$results = $db->query("SELECT * FROM comments ORDER BY DATETIME(date) DESC LIMIT 1");

if(!$results) {
    echo $db->lastErrorMsg();
} else {
    $posts = array();
    while ($row = $results->fetchArray()) {
        $post_data = array(
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