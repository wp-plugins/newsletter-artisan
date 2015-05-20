<?php

$baseAppPath = dirname(__FILE__) . '/';
require_once($baseAppPath . '../util/util.php');
require_once($baseAppPath . 'Node.php');
require_once($baseAppPath . 'Nodes_Abstract.php');

function is_already_added($needle, $haystack) {
	(sizeof($haystack) === 0) ? false : T_CONTINUE;
	foreach($haystack as $key) {
		if ($needle == $key->ID) {
			return true;
		}
	}
	return false;
}

class Posts_Nodes extends Nodes_Abstract {
	//public static $nodes_abstract_length = 0;

	/* add node only if it's not already added */
	public function add($post, $node_type = "wp_post_type") {
		$table_name = "Nodes-posts";
		//make sure that db is ready for the data
		$this->set_na_nodes_table($table_name);
		$nodes_table = $this->na_table[$table_name];

		if (!is_already_added($post->ID, $nodes_table)) {

			$post_node = new Node($post, $node_type);
			array_push($this->na_table[$table_name], $post_node->content);
		}

		$this->updateDB();
	}

	public function inject_node($html_node, $position) {
		//todo
		//////
		array_splice($this->na_table["Nodes-posts"], $position, 0, $html_node);
	}

	public function changeOrder($new_order = array()) {
		$new_na_table = array();

		//validate
		if ( sizeof($this->na_table["Nodes-posts"]) !== sizeof($new_order)) {
			app_error('wrong number of posts passed in Nodes class, changeOrder function.');
		}

		foreach($new_order as $new_order_id) {

			foreach($this->na_table["Nodes-posts"] as $key=>$node) {
				//$key->node id
				if ((int)$new_order_id === $node->ID) {
					array_push($new_na_table, $node);
				}
			}
		}
		$this->na_table["Nodes-posts"] = $new_na_table;
		$this->updateDB();
	}

	//todo remove single node
	//////
	public function remove($node_id) {
		$na_table = get_option('newsletter_artisan', array());
	}

	public function reset() {
		$this->na_table["Nodes-posts"] = array();
		$this->updateDB();
	}

	public function checkDB() {
		var_dump(get_option('newsletter_artisan') );
	}

}

?>