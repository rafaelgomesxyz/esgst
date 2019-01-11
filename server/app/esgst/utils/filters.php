<?php

require_once __DIR__.'/../class/CustomException.php';

function validate_filters($filters, $validation) {
  $filter_keys = array_keys($filters);
  $validation_keys = array_keys($validation);

  if (array_diff($filter_keys, $validation_keys)) {
    throw new CustomException('Invalid query parameters. Only the following parameters are allowed: '.implode(', ', $validation_keys), 400);
  }

  foreach ($validation as $key => $element) {
    if (!isset($filters[$key])) {
      continue;
    }

    if (!preg_match($element['regex'], $filters[$key])) {
      throw new CustomException('Invalid '.$key.' parameter. '.$element['message'], 400);
    }

    if (!$element['conflicts']) {
      continue;
    }

    $intersection = array_intersect($filter_keys, $element['conflicts']);
    if ($intersection) {
      throw new CustomException('Invalid query parameters. The following parameters are conflicting with each other: '.$key.', '.implode(', ', $intersection), 400);
    }
  }
}