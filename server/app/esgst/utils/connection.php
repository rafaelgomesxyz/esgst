<?php

require_once __DIR__.'/../class/CustomException.php';
require_once __DIR__.'/credentials.php';              // get_credentials

function start_connection() {
  global $connection;

  $credentials = get_credentials();

  try {
    $data_source_name = 'mysql:host=localhost;dbname=gsrafa29_esgst';
    $username = $credentials['username'];
    $password = $credentials['password'];
    $options = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => FALSE
    ];
    $connection = new PDO($data_source_name, $username, $password, $options);
  } catch (PDOException $exception) {
    throw CustomException::fromException($exception);
  }
}