<?php
// api.php - Gyors adatbazis muveletek
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// Csatlakozas a leiras alapjan
try {
    $kapcsolat = new PDO('mysql:host=localhost;dbname=formaegy', 'formaegy', 'Hurrikan122',
        array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
} catch(PDOException $hiba) {
    die(json_encode(["gondVan" => $hiba->getMessage()]));
}

$keresTipusa = $_SERVER['REQUEST_METHOD'];
$kuldottAdat = json_decode(file_get_contents("php://input"), true);

if ($keresTipusa == 'GET') {
    // Minden adat kikerese
    $lekerdezes = $kapcsolat->query("SELECT * FROM nagydijak");
    $eredmeny = $lekerdezes->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($eredmeny);
} 
elseif ($keresTipusa == 'POST') {
    // Uj sor hozzaadasa
    $bemenetDatum = $kuldottAdat['datum'];
    $bemenetNev = $kuldottAdat['nev'];
    $bemenetHely = $kuldottAdat['helyszin'];
    $beszuroCsomag = $kapcsolat->prepare("INSERT INTO nagydijak (datum, nev, helyszin) VALUES (?, ?, ?)");
    $beszuroCsomag->execute([$bemenetDatum, $bemenetNev, $bemenetHely]);
    echo json_encode(["siker" => "belerakva"]);
} 
elseif ($keresTipusa == 'PUT') {
    // Meglevo modositas
    $szerkesztettId = $kuldottAdat['id'];
    $szerkesztettDatum = $kuldottAdat['datum'];
    $szerkesztettNev = $kuldottAdat['nev'];
    $szerkesztettHely = $kuldottAdat['helyszin'];
    $modositoCsomag = $kapcsolat->prepare("UPDATE nagydijak SET datum=?, nev=?, helyszin=? WHERE id=?");
    $modositoCsomag->execute([$szerkesztettDatum, $szerkesztettNev, $szerkesztettHely, $szerkesztettId]);
    echo json_encode(["siker" => "atrakva"]);
} 
elseif ($keresTipusa == 'DELETE') {
    // Adat kitorlese
    $torlendoId = $kuldottAdat['id'];
    $torloCsomag = $kapcsolat->prepare("DELETE FROM nagydijak WHERE id=?");
    $torloCsomag->execute([$torlendoId]);
    echo json_encode(["siker" => "kikukazva"]);
}
?>