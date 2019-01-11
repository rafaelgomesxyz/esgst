<?php

require_once __DIR__.'/../class/CustomException.php';
require_once __DIR__.'/../class/Request.php';
require_once __DIR__.'/../utils/timezones.php';       // set_timezones
require_once __DIR__.'/../utils/connection.php';      // start_connection
require_once __DIR__.'/../utils/dom.php';             // filter_child_nodes

do_rcv_sg_cron_job();

function do_rcv_sg_cron_job() {
  global $connection;

  try {
    update_rcv_sg();
  } catch (CustomException $exception) {
    if (isset($connection) && $connection->inTransaction) {
      $connection->rollback();
    }
  }
}

function update_rcv_sg() {
  try {
    fetch_rcv_sg();
  } catch (CustomException $exception) {
    throw $exception;
  } catch (Exception $exception) {
    throw CustomException::fromException($exception);
  }
}

function fetch_rcv_sg() {
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

  $page = 0;
  $ended = FALSE;
  do {
    sleep(1);

    $page += 1;
    
    error_log(__FILE__.':'.__LINE__.' => '.$page);

    $url = 'https://www.steamgifts.com/bundle-games/search?page='.$page;
    $response = Request::fetch($url);
    $xpath = $response['xpath'];

    if (!isset($xpath)) {
      throw new CustomException($internal_errors['sg'], 500, $response['text']);
    }

    $elements = $xpath->query('//div[contains(@class, "table__row-inner-wrap")]');
    foreach ($elements as $element) {
      $link = $xpath->query('.//a[contains(@class, "table__column__secondary-link")]', $element)[0];

      if (!$link) {
        continue;
      }

      preg_match('/(app|sub)\/(\d+)/', $link->getAttribute('href'), $matches);

      $type = $matches[1];
      $id = intval($matches[2]);
      $name = $xpath->query('.//p[contains(@class, "table__column__heading")]', $element)[0]->nodeValue;
      $date = (new DateTime($xpath->query('.//div[contains(@class, "table__column--width-small")]', $element)[0]->nodeValue, $global_timezone))->format('Y-m-d');

      $name_parameters[$type] []= $id;
      $name_parameters[$type] []= $name;
      $rcv_parameters[$type] []= $id;
      $rcv_parameters[$type] []= $date;
      $rcv_parameters[$type] []= TRUE;
    }

    $pagination = $xpath->query('//div[contains(@class, "pagination__navigation")]')[0];

    if (!$pagination) {
      throw new CustomException($internal_errors['sg'], 500, $response['text']);
    }

    filter_child_nodes($pagination);

    $ended = preg_match('/is-selected/', $pagination->lastChild->getAttribute('class'));
  } while (!$ended);

  start_connection();

  $connection->beginTransaction();

  foreach (['app', 'sub'] as $type) {
    $query = 'UPDATE games__'.$type.'_rcv SET found = FALSE';
    $connection->query($query);

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
        'INSERT INTO games__'.$type.'_rcv ('.$type.'_id, date, found)',
        'VALUES '.implode(', ', array_fill(0, $num_parameters / 3, '(?, ?, ?)')),
        'ON DUPLICATE KEY UPDATE found = VALUES(found)'
      ]);
      $statement = $connection->prepare($query);
      $statement->execute($rcv_parameters[$type]);
    }

    $query = implode(' ', [
      'DELETE FROM games__'.$type.'_rcv',
      'WHERE found = FALSE'
    ]);
    $connection->query($query);
  }

  $connection->commit();
}