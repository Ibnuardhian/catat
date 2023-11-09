<?php
session_start();
$servername = "localhost:3307";
$username = "root";
$password = "pass123";
$database = "imk_todolist";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn){
    die("Koneksi Gagal: " . mysqli_connect_error());
} else {
    echo "Koneksi Berhasil";
}
?>