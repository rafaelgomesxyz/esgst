<?php

function set_timezones() {
  global $server_timezone;
  global $global_timezone;

  $server_timezone = new DateTimeZone('CST');
  $global_timezone = new DateTimeZone('UTC');
}