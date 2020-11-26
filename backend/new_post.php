<?php
// Create database
$db = new SQLite3('community.db');

// Prepare and bind
$stmt = $db->prepare("INSERT INTO posts (username, title, content, topic) VALUES (:username, :title, :content, :topic)");
if (!$stmt) {
    echo $db->lastErrorMsg();
}
$stmt->bindParam(':username', $username);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':content', $content);
$stmt->bindParam(':topic', $topic);


// Set parameters and execute
$username = $_POST["username"];
$title = $_POST["title"];
$content = $_POST["content"];
$topic = $_POST["topic"];
$stmt->execute();

//if(!$results) {
//    echo $db->lastErrorMsg();
//} else {
//    $posts = array();
//    while ($row = $results->fetchArray()) {
//        $post_data = array(
//            "id" => $row["id"],
//            "username" => $row["username"],
//            "title" => $row["title"],
//            "content" => $row["content"],
//            "topic" => $row["topic"],
//            "comments" => $row["comments"],
//            "views" => $row["views"],
//            "likes" => $row["likes"],
//            "follows" => $row["follows"],
//            "date" => $row["date"]
//        );
//        $postJSON = json_encode($post_data);
//        array_push($posts, $postJSON);
//    }
//    return print_r($posts);
//}

?>