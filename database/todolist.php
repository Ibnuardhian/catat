<?php
$sql = "SELECT taskid, tasklabel, taskstatus, createdate FROM your_table";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
    while($row = $result->fetch_assoc()) {
    echo "taskid: " . $row["taskid"]. " - tasklabel: " . $row["tasklabel"]. " - taskstatus: " . $row["taskstatus"]. " - createdate: " . $row["createdate"]. "<br>";
}
} else {
    echo "0 results";
}
$conn->close();
?>
