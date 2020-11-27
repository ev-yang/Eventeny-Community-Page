<?php
// Get database
$db = new SQLite3('community.db');

// Prepare and bind
$type = $_POST["type"];
$updated = $_POST["updated"];
$id = $_POST["id"];
$stmt = $db->prepare("UPDATE posts SET `$type` = :updated WHERE id = :id");
if (!$stmt) {
    echo $db->lastErrorMsg();
}
$stmt->bindParam(":updated", $updated);
$stmt->bindParam(':id', $id);
$stmt->execute();

?>