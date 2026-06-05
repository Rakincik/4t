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

$sql = file_get_contents("db.sql");
if (!$sql) {
    die("db.sql dosyasi okunamadi!");
}

// Windows ortamindan gelen gizli BOM karakterlerini temizleyelim 
$sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);

// Plesk veritabaninda kullanicinin yetkisini asan (ve zaten varsayilan olarak var olan) gereksiz sema olusturma komutunu atlayalim
$sql = str_replace('CREATE SCHEMA IF NOT EXISTS "public";', '', $sql);

$result = pg_query($dbconn, $sql);

if (!$result) {
    die("Tablo olusturulurken hata cikti: " . pg_last_error($dbconn));
}

echo "<h1>Hooop! Database tables created successfully! Siteniz %100 kullanima hazir!</h1>";
pg_close($dbconn);
?>
