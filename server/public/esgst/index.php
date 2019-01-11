<?php

require '../../vendor/autoload.php'; // \Slim\App

$internal_errors = [
  'default' => 'Internal error. Please contact the administrator.',
  'steam' => 'Internal error when fetching data from Steam. Steam might be down or the data might not exist. Please try again later.'
];

$app = new \Slim\App();
$container = $app->getContainer();
$container['phpErrorHandler'] = function ($container) {
  return function ($request, $response, $error) use ($container, $internal_errors) {
    error_log(__FILE__.':'.__LINE__.' => '.$error);

    return $response->withJson([
      'error' => $internal_errors['default']
    ], 500);
  };
};

require '../../app/esgst/routes/games/game.php';
require '../../app/esgst/routes/games/rcv.php';

$app->run();