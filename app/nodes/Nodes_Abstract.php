<?php

abstract class Nodes_Abstract {

	protected $na_table = array();

	function __construct() {
		if (isNotUnitTest()) {
			//cache db for na
			$this->na_table = get_option('newsletter_artisan', array());
		}
	}

	abstract public function add($post, $node_type);
	abstract public function reset();

	protected function updateDB() {
		update_option('newsletter_artisan', $this->na_table);
	}

	protected function set_na_nodes_table($table_name) {
		//$nodes_table = ;
		if (!isset($this->na_table[$table_name])) {
			$this->na_table[$table_name] = array();
		}
	}
}

?>