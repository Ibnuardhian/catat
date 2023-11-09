<?php
require 'koneksi.php';
$email = $_POST["email"];
$password = $_POST["password"];

$query_sql = "INSERT INTO tbl_users (email, password) VALUES ( '$email', '$password')";

if (mysqli_query($conn, $query_sql)){
    header("Location: ./login.html");
} else {
    echo "Pendaftaran gagal : ". mysqli_error($conn);
}
?>

