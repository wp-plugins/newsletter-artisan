<?php

$baseAppPath = dirname(__FILE__) . '/';
require_once($baseAppPath . '../util/util.php');
require_once($baseAppPath . 'Node.php');
require_once($baseAppPath . 'Nodes_Abstract.php');

class HTML_Nodes extends Nodes_Abstract {

	public function add($node, $node_type) {
		$table_name = 'Nodes-HTML';
		$this->set_na_nodes_table($table_name);
		$nodes_table = $this->na_table["Nodes-HTML"];

		$html_node = new Node((object)$node, $node_type);
		array_push($this->na_table[$table_name], $html_node->content);

		$this->updateDB();
	}

	protected function create_node_content($unique_id, $template) {
		$node_data = array();
		$node_data["ID"] = $unique_id;
		$node_data["template"] = $template;
		$node_data["containers_ids"] = array();

		return $node_data;
	}

	public function reset() {
		$this->na_table["Nodes-HTML"] = array();
		$this->updateDB();
	}

	public function remove_node($id) {
		$this->na_table = get_na_data();
		foreach ($this->na_table["Nodes-HTML"] as $key=>$node) {
			if ($node->ID === $id) {
				array_splice($this->na_table["Nodes-HTML"], $key, 1);
				$this->updateDB();
			}
		}
	}

	public function change_template($data) {
		$id = (array)$data["id"];
		$template = (array)$data["template"];
		//change a template
		foreach ($this->na_table["Nodes-HTML"] as $key=>$node) {

			
			if ($node->ID === $id[0]) {
				$this->na_table["Nodes-HTML"][$key]->template = $template[0];
				$this->updateDB();
			}
		}
	}

	/**
	* Container ids are are helpful to match an HTML Node with relevant place
	* inside of a theme
	*/
	public function add_container_ids($id, $containers_ids) {
		$this->na_table = get_na_data();

		foreach ($this->na_table["Nodes-HTML"] as $key=>$node) {
			if ($node->ID === $id) {

				$result = array_merge($this->na_table["Nodes-HTML"][$key]->containers_ids, $containers_ids);
				$this->na_table["Nodes-HTML"][$key]->containers_ids = $result;

				$this->updateDB();
			}
		}
	}

	public function reset_container_ids($node_id) {
		$this->na_table = get_na_data();

		foreach ($this->na_table["Nodes-HTML"] as $key=>$node) {
			if ($node->ID === $node_id) {

				$this->na_table["Nodes-HTML"][$key]->containers_ids = array();

				$this->updateDB();
			}
		}
	}


	public function override_container_ids($id, $containers_ids) {
		$this->na_table = get_na_data();

		foreach ($this->na_table["Nodes-HTML"] as $key=>$node) {
			if ($node->ID === $id) {

				$this->na_table["Nodes-HTML"][$key]->containers_ids = $containers_ids;
				$this->updateDB();
			}
		}
	}


}

?>