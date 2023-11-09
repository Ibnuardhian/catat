<?php
session_start();
$servername = "localhost";
$database = "imk_todolist";
$username = "root"; // Change this variable to $username for the correct parameter
$password = "";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn){
    die("Koneksi Gagal: " . mysqli_connect_error());
} else {
    echo "Koneksi Berhasil";
}
?>