<?php
$host = "127.0.0.1";
$port = "5432";
$dbname = "admin_on7_4t";
$user = "4t_admin";
$password = "4tAdmin_.*";

$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";
$dbconn = pg_connect($conn_string);

if (!$dbconn) {
    die("Veritabanina baglanilamadi: " . pg_last_error());
}

$sql = "UPDATE \"User\" SET role = 'ADMIN'";
$result = pg_query($dbconn, $sql);

if (!$result) {
    die("Hata: " . pg_last_error($dbconn));
}

echo "<h1>Hooop! Hesabiniz ADMIN yoneticisine yukseltildi! Mutevazi admin panelinize girebilirsiniz.</h1>";
pg_close($dbconn);
?>
