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

$id = "admin_" . uniqid();
$email = "admin@4takademi.com";
$hash = '$2b$10$YBzMiXm8HwLcIbnZeadk4eFGCQZtnUvPKZxlBQN6mtluyXjHcXZTK';
$name = "Kurucu";
$now = date('Y-m-d\TH:i:sP');

$sql = "INSERT INTO \"User\" (\"id\", \"email\", \"password\", \"name\", \"role\", \"createdAt\", \"updatedAt\") 
        VALUES ('$id', '$email', '$hash', '$name', 'ADMIN', '$now', '$now')
        ON CONFLICT (\"email\") DO UPDATE SET \"password\" = '$hash', \"role\" = 'ADMIN';";

$result = pg_query($dbconn, $sql);

if (!$result) {
    die("Hata: " . pg_last_error($dbconn));
}

echo "<h1>Hooop! Admin hesabi basariyla olusturuldu! Artik giris yapabilirsiniz:</h1>";
echo "<h3>E-posta: " . $email . "</h3>";
echo "<h3>Sifre: 4t_Admin.2026*</h3>";
pg_close($dbconn);
?>
