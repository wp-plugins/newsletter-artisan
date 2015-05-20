<?php

$baseAppPath = dirname(__FILE__) . '/';
require_once($baseAppPath . '../util/util.php');
require_once($baseAppPath . 'INode.php');

class Node implements INode {
	public $content = array();
	private $post;

	function __construct($node_data, $type) {
		$this->content = $node_data;
		$this->updateType($type);
	}

	public function updateType($type) {
		$this->content = (array)$this->content;
		$this->content["node_type"] = $type;
		$this->content = (object)$this->content;
	}

}

?>