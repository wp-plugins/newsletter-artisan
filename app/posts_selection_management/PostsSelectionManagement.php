<?php

$baseAppPath = dirname(__FILE__) . '/';
require_once($baseAppPath . '../util/util.php');
require_once($baseAppPath . '../nodes/Node.php');
require_once($baseAppPath . '../nodes/Nodes_Abstract.php');

class Posts_Selection extends Nodes_Abstract {

	public function add($node, $node_type) {
		$table_name = 'Nodes-Both';
		$this->set_na_nodes_table($table_name);
		$nodes_table = $this->na_table["Nodes-Both"];

		$html_node = new Node((object)$node, $node_type);
		array_push($this->na_table[$table_name], $html_node->content);

		$this->updateDB();
	}

	public function reset() {
		$this->na_table["Nodes-Both"] = array();
		$this->updateDB();
	}

	private function returnNewsletterUrl() {
		$newsletter_urlarg = array(
		    'meta_key' => '_wp_page_template',
		    'meta_value' => 'newsletter_artisan.php'
		);

		$newsletter_url = get_pages( $newsletter_urlarg );

		echo $newsletter_url[0]->guid;
	}

	public function addAll($collection, $ordering) {
		$table_name = 'Nodes-Both';
		$table_ordering = 'Nodes-Both-ordering';

		$this->set_na_nodes_table($table_name);
		$this->set_na_nodes_table($table_ordering);

		$this->na_table[$table_name] = $collection;
		$this->na_table[$table_ordering] = $ordering;
		$this->updateDB();

		$this->returnNewsletterUrl();
	}

	public function getAdditionalPostsData($postsIds) {
		$collection = array();

		foreach($postsIds as $key => $id) {
			$collection[$id] = array(
				"post_thumbnail" => wp_get_attachment_url( get_post_thumbnail_id($id) )
			);
		}

		echo json_encode($collection);
	}

	public function getAll() {
		$db = get_option('newsletter_artisan');
		$collection = $db["Nodes-Both"];

		echo json_encode($collection);
	}

	public function getAllForController() {
		$db = get_option('newsletter_artisan');
		$data = array(
			'collection'=>$db["Nodes-Both"],
			'ordering'=>$db["Nodes-Both-ordering"]
			);

		return $data;
	}
}

?>