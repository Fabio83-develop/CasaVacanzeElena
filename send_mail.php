<?php 
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanifica e recupera i dati del form
    $name     = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email    = filter_input(INPUT_POST, '_replyto', FILTER_VALIDATE_EMAIL);
    $phone    = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $checkin  = filter_input(INPUT_POST, 'checkin', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $checkout = filter_input(INPUT_POST, 'checkout', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $guests   = filter_input(INPUT_POST, 'guests', FILTER_SANITIZE_NUMBER_INT);
    $message  = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);


    // Configura i dettagli della email
    $to      = 'contatti@mypokemon.it'; // Sostituisci con il tuo indirizzo email
    $subject = 'Nuova richiesta dal form contatti';
    $body    = "Nome: $name\nEmail: $email\nTelefono: $phone\nData di Arrivo: $checkin\nData di Partenza: $checkout\nNumero di Ospiti: $guests\nMessaggio: $message";
    $headers = "From: postmaster@mypokemon.it\r\n" . // Sostituisci con una email autorizzata dal tuo dominio
               "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        // Invia una risposta in formato JSON per la gestione via fetch in script.js
        echo json_encode([
            "status"  => "success",
            "message" => "Grazie per averci contattato!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Errore nell'invio del messaggio."
        ]);
    }
} else {
    http_response_code(405);
    echo "Metodo non consentito.";
}
?>