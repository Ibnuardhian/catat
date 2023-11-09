<?php
require 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = mysqli_real_escape_string($conn, $_POST["firstname"]);
    $lastName = mysqli_real_escape_string($conn, $_POST["lastname"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = password_hash($_POST["password"], PASSWORD_BCRYPT);
    $confirmpassword = $_POST["confirmpassword"];
    $query_sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashedPassword')";

    $duplicate = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email'");
    if (mysqli_num_rows($duplicate) > 0) {
        echo "<script> alert('Email Has Already Been Taken'); </script>";
    } else {
        if (password_verify($confirmpassword, $password)) {
            $query = "INSERT INTO users (firstname, lastname, email, password) VALUES ('$firstName', '$lastName', '$email', '$password')";
            if (mysqli_query($conn, $query)) {
                header("location: ../pages/login.html");
                exit;
            } else {
                echo "Error: " . $query . "<br>" . mysqli_error($conn);
            }
        } else {
            echo "<script> alert('Password Does Not Match'); </script>";
        }
    }
}
?>
