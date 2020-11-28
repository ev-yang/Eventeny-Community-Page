<!--
  Evelyn Yang
  Eventeny Community Page
  November 25, 2020

  This is the increment_stats.php file for the Eventeny community page.
  It increments the given type of statistic of the given post by one.
-->

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
$stmt->bindParam(":id", $id);
$stmt->execute();
?>