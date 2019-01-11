<?php

function filter_child_nodes($node) {
  $to_remove = [];
  $child_nodes = $node->childNodes;
  foreach ($child_nodes as $child_node) {
    if ($child_node->nodeType !== XML_ELEMENT_NODE) {
      $to_remove []= $child_node;
    }
  }
  foreach ($to_remove as $child_node) {
    $node->removeChild($child_node);
  }
}