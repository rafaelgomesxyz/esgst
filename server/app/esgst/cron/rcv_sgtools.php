<?php

require_once __DIR__.'/../class/CustomException.php';
require_once __DIR__.'/../class/Request.php';
require_once __DIR__.'/../utils/timezones.php';       // set_timezones
require_once __DIR__.'/../utils/connection.php';      // start_connection
require_once __DIR__.'/../utils/dom.php';             // filter_child_nodes

do_rcv_sgtools_cron_job();

function do_rcv_sgtools_cron_job() {
  global $connection;

  try {
    update_rcv_sgtools();
  } catch (CustomException $exception) {
    if (isset($connection) && $connection->inTransaction) {
      $connection->rollback();
    }
  }
}

function update_rcv_sgtools() {
  try {
    fetch_rcv_sgtools();
  } catch (CustomException $exception) {
    throw $exception;
  } catch (Exception $exception) {
    throw CustomException::fromException($exception);
  }
}

function fetch_rcv_sgtools() {
  global $connection;
  global $global_timezone;

  set_timezones();

  $name_parameters = [
    'app' => [],
    'sub' => []
  ];
  $rcv_parameters = [
    'app' => [],
    'sub' => []
  ];

  $url = 'https://www.sgtools.info/lastbundled';
  $response = Request::fetch($url);
  $doc = $response['doc'];

  if (!isset($doc)) {
    throw new CustomException($internal_errors['sg'], 500, $response['text']);
  }

  $elements = $doc->getElementsByTagName('tr');
  for ($i = 1, $n = $elements->length; $i < $n; $i++) {
    $element = $elements[$i];

    filter_child_nodes($element);
    filter_child_nodes($element->firstChild);
    
    $link = $element->firstChild->firstChild;

    preg_match('/(app|sub)\/(\d+)/', $link->getAttribute('href'), $matches);

    $type = $matches[1];
    $id = intval($matches[2]);
    $name = $link->nodeValue;
    $date = (new DateTime($element->firstChild->nextSibling->nodeValue, $global_timezone))->format('Y-m-d');

    $name_parameters[$type] []= $id;
    $name_parameters[$type] []= $name;
    $rcv_parameters[$type] []= $id;
    $rcv_parameters[$type] []= $date;
    $rcv_parameters[$type] []= TRUE;
  }

  start_connection();

  $connection->beginTransaction();

  foreach (['app', 'sub'] as $type) {
    $num_parameters = count($name_parameters[$type]);
    if ($num_parameters > 0) {
      $query = implode(' ', [
        'INSERT IGNORE INTO games__'.$type.'_name ('.$type.'_id, name)',
        'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
      ]);
      $statement = $connection->prepare($query);
      $statement->execute($name_parameters[$type]);
    }

    $num_parameters = count($rcv_parameters[$type]);
    if ($num_parameters > 0) {
      $query = implode(' ', [
        'INSERT IGNORE INTO games__'.$type.'_rcv ('.$type.'_id, date, found)',
        'VALUES '.implode(', ', array_fill(0, $num_parameters / 3, '(?, ?, ?)'))
      ]);
      $statement = $connection->prepare($query);
      $statement->execute($rcv_parameters[$type]);
    }
  }

  $connection->commit();
}