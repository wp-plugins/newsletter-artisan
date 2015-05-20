<?php

	$baseAppPath = dirname(__FILE__) . '/../';
	require_once($baseAppPath . 'util/util.php');
	require_once($baseAppPath . 'nodes/HTML_Nodes.php');

	class HtmlNodesManagement extends HTML_Nodes {
		
		public function create_node($data) {
			$node = $this->create_node_content($data["id"], $data["template"]);
			//function present in Nodes_Abstract.php
			$this->add($node, 'html_type');
		}

        private function cleanupCode($collection) {
            foreach($collection as $key=>&$val) {
                $val["node_code"] = removeslashes($val["node_code"]);
            }
            return $collection;
        }

		public function add_collection($data) {
			$this->addAll($data);
		}

		public function addHTMLNodeCollection($collection) {
			$table_name = 'Nodes-HTMLCollection';
			$this->set_na_nodes_table($table_name);
            $cleanCode = $this->cleanupCode($collection);
			$this->na_table["HTMLCollection"] = $cleanCode;
			$this->updateDB();
		}

		public function resetHTMLNodesCollectionOnServer() {
			$table_name = 'Nodes-HTMLCollection';
			$this->set_na_nodes_table($table_name);
			$this->na_table["HTMLCollection"] = array();

			$this->updateDB();
		}

		public function getHTMLNodeCollection() {
			$table_name = 'Nodes-HTMLCollection';
			$this->set_na_nodes_table($table_name);
			
			echo json_encode( $this->na_table["HTMLCollection"] );
		}
		
	}
?>