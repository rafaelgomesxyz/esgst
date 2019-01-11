<?php

class Request {
  public function __construct() { }

  public static function fetch($url, $options = []) {
    $headers = [];
    $response = [
      'text' => NULL,
      'url' => NULL
    ];

    $curl_request = curl_init();
    curl_setopt($curl_request, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl_request, CURLOPT_URL, $url);
    if ($options['cookie']) {
      curl_setopt($curl_request, CURLOPT_COOKIE, $options['cookie']);
    }
    if ($options['headers']) {
      curl_setopt($curl_request, CURLOPT_HTTPHEADER, $options['headers']);
    }
    curl_setopt($curl_request, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$headers) {
      $length = strlen($header);
      $header = explode(':', $header, 2);
      if (count($header) >= 2) {
        $name = strtolower(trim($header[0]));
        $headers[$name] = trim($header[1]);
      }

      return $length;
    });
    $text = curl_exec($curl_request);
    $url = curl_getinfo($curl_request, CURLINFO_EFFECTIVE_URL);
    curl_close($curl_request);

    if ($headers['content-encoding'] === 'gzip') {
      $text = gzdecode($text);
    }
    $response['text'] = $text;
    $response['url'] = $url;

    if (preg_match('/application\/json/', $headers['content-type'])) {
      $response['json'] = json_decode($text, TRUE);
    } else if (preg_match('/text\/html/', $headers['content-type'])) {
      $doc = new DOMDocument();
      $doc->loadHTML($text);
      $response['doc'] = $doc;
      $response['xpath'] = new DOMXpath($doc);
    }

    return $response;
  }
}