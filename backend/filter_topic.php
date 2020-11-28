<!--
  Evelyn Yang
  Eventeny Community Page
  November 25, 2020

  This is the filter_topic.php file for the Eventeny community page.
  It selects the IDs of all posts matching a given topic and provides
  an array of those IDs.
-->

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