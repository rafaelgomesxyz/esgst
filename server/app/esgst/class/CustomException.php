<?php

class CustomException extends Exception {
  public function __construct($message, $code, $log_message = NULL) {
    if ($log_message) {
      error_log($this->getFile().':'.$this->getLine().' => '.$log_message);
    }
    parent::__construct($message, $code);
  }

  public static function fromException($exception) {
    global $internal_errors;
    return new self($internal_errors['default'], 500, $exception->getMessage());
  }
}