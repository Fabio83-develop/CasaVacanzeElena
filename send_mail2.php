<?php
// Abilita la visualizzazione degli errori per il debug (rimuovi in produzione)
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'PHPMailer/PHPMailer.php'; 
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email    = filter_input(INPUT_POST, '_replyto', FILTER_VALIDATE_EMAIL);
    $phone    = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $checkin  = filter_input(INPUT_POST, 'checkin', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $checkout = filter_input(INPUT_POST, 'checkout', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $guests   = filter_input(INPUT_POST, 'guests', FILTER_SANITIZE_NUMBER_INT);
    $message  = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    $mail = new PHPMailer(true);

    try {
        // Configurazione SMTP per Aruba con SSL consigliata
        $mail->isSMTP();
        $mail->Host       = 'smtps.aruba.it';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'postmaster@mypokemon.it'; // Il tuo username (indirizzo completo)
        $mail->Password   = '3jhy5_g8wLDhzeD';   // La password della casella
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        // Imposta il mittente: deve essere lo stesso dell'account autenticato
        $mail->setFrom('postmaster@mypokemon.it', 'Casa Vacanze Elena');
        // Destinatario: l'email a cui vuoi ricevere i messaggi
        $mail->addAddress('contatti@mypokemon.it');

        // Contenuto della email
        $mail->isHTML(false);
        $mail->Subject = 'Nuova richiesta dal form contatti';
        $mail->Body    = "Nome: $name\nEmail: $email\nTelefono: $phone\nData di Arrivo: $checkin\nData di Partenza: $checkout\nNumero di Ospiti: $guests\nMessaggio: $message";

        $mail->send();
        echo json_encode([
            "status"  => "success",
            "message" => "Grazie per averci contattato!"
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Errore nell'invio: {$mail->ErrorInfo}"
        ]);
    }
} else {
    http_response_code(405);
    echo "Metodo non consentito.";
}
?>
