<?php
require 'koneksi.php';
$email = $_POST["email"];
$password = $_POST["password"];

// Ambil hash kata sandi dari database berdasarkan alamat email
$query_sql = "SELECT password FROM users WHERE email = '$email'";
$result = mysqli_query($conn, $query_sql);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $hashedPassword = $row["password"];

    // Verifikasi kata sandi yang di-inputkan dengan hash yang ada di database
    if (password_verify($password, $hashedPassword)) {
        // Kata sandi benar
        header("Location: ../pages/dashboard.html");
    } else {
        // Kata sandi salah
        echo "<center><h1> Email atau Password Salah. Silakan Input Dengan Benar.</h1><button><strong><a href='../pages/login.html'>Login</a></strong></button></center>";
    }
} else {
    // Pengguna dengan email tertentu tidak ditemukan
    echo "<center><h1> Email tidak ditemukan.</h1><button><strong><a href='login.html'>Login</a></strong></button></center>";
}
?>