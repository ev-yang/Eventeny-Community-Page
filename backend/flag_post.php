<?php
// Get database
$db = new SQLite3('community.db');

// Create table
$db->exec("CREATE TABLE IF NOT EXISTS flags (
    id INTEGER,
    post_id INTEGER,
    title TEXT,
    content TEXT,
    date DATETIME DEFAULT (datetime('now', 'localtime')),
    PRIMARY KEY('id' AUTOINCREMENT)
)");

// Get query parameters
$id = $_POST["id"];
$title = $_POST["title"];
$content = $_POST["content"];

// Prepare, bind, and execute SQL
$stmt = $db->prepare("INSERT INTO flags (post_id, title, content) VALUES (:id, :title, :content)");
if (!$stmt) {
    echo $db->lastErrorMsg();
}
$stmt->bindParam(":id", $id);
$stmt->bindParam(":title", $title);
$stmt->bindParam(":content", $content);
$stmt->execute();

?>