<?php

require_once __DIR__.'/../../class/CustomException.php';

$app->get('/users/history', function ($request, $response) {
  try {
    return $response
      ->withJson([
        'error' => NULL,
        'result' => NULL
      ], 200)
    ;
  } catch (CustomException $exception) {
    return $response
      ->withJson([
        'error' => $exception->getMessage(),
        'result' => NULL
      ], $exception->getCode())
    ;
  }
});