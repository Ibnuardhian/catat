<?php
//add tasklist to database
$task_name = $_POST['task'];
$userid = $_SESSION["UserID"];
$date = date("Y-m-d");  //get current date and time
if(isset($_POST['submit'])){
    $sql="INSERT INTO tasks (TaskName, UserId, Date) VALUES ('".$task_name."', '".$userid."','
    ".$date.")";
    if ($conn->query($sql) === TRUE){
        echo "<script>alert('New Task Added!')</script>";
        header("Location: ../index.html");
        } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    }else{
    echo "No data received from form";
}
?>