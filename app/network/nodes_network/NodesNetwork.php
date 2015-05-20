<?php
/* Network module - Nodes */

	$baseAppPath = dirname(__FILE__) . '/../../';
	require_once($baseAppPath . 'util/util.php');
	require_once($baseAppPath . 'ui/posts_ui/PostsUI.php');
	require_once($baseAppPath . 'posts_selection_management/PostsSelectionManagement.php');
	require_once($baseAppPath . '../html_nodes_management/HtmlNodesManagement.php');

	/**
	* nodesNetwork class
	* API for posts selection tab in WP admin panel
	*/
	/*
	* usage example on client (delete this later)
		var $ = jQuery;				
		var that = this,
			data = {
			action: 'nodes',
            nodes_action: 'getNodes'
		};
		$.post(ajaxurl, data, function (resp) {
			console.log(resp);
		});
		var data = {
			action: 'nodes',
            nodes_action: {
            	"route": 'AddNodesCollection',
            	"nodes_data": {
					"collection": {},
					"ordering": []
            	}
		};
	*/

	class NodesNetwork {

		public function route($do) {
			$postsSelectionManagement = new Posts_Selection();
			$htmlNodesManagement = new HtmlNodesManagement();

			switch ($do["route"]) {

				case 'AddNodesCollection':
					$data = $do["nodes_data"];
					$collection = $data["collection"];

					if (isset($data["nodesOrdering"])) {
						$ordering = $data["nodesOrdering"];

						$tempdata = html_entity_decode($collection);
						$witoutslashes = stripslashes($tempdata);
						$readyData = json_decode($witoutslashes);

						$postsSelectionManagement->addAll($readyData, $ordering);
					} else {
						app_error('Ordering was not set in the POST req.');
					}

					break;

				case 'getAdditionalPostsData':
					$data = $do["nodes_data"];
					$postsIDs = $data["postsIDs"];
					$postsSelectionManagement->getAdditionalPostsData($postsIDs);

				break;
				case 'getNodesCollection':
					$postsSelectionManagement->getAll();
					break;

				case 'getNodes':
					$pick_posts = new PostsUI();
					$pick_posts->displayData();
					break;

				case 'addHTMLNodeCollection':
					$data = $do["nodes_data"];
					$collection = $data['collection'];
					$htmlNodesManagement->addHTMLNodeCollection($collection);

					break;

				case 'resetHTMLNodesCollectionOnServer':
					$htmlNodesManagement->resetHTMLNodesCollectionOnServer();

					break;

				case 'getHTMLNodeCollection':
					$htmlNodesManagement->getHTMLNodeCollection();

					break;

/**
* the rest of the cases are
* for development purposes only
*/
				case 'AddContainerIdsHTMLNode':
					$data = $do["nodes_data"];
					$id = (array)$data["id"];
					$container_ids = (array)$data["containers_ids"];

					$htmlNodesManagement->add_container_ids($id[0], $container_ids);

					break;

				case 'OverrideContainerIdsHTMLNode':
					$data = $do["nodes_data"];
					$id = (array)$data["id"];
					$container_ids = (array)$data["containers_ids"];

					$htmlNodesManagement->override_container_ids($id[0], $container_ids);

					break;

				case 'ResetContainerIdsHTMLNode':
					$data = $do["nodes_data"];
					$id = (array)$data["id"];
					$htmlNodesManagement->reset_container_ids($id[0]);

					break;

				case 'addHTMLNode':
					$htmlNodesManagement->create_node($do["nodes_data"]);

					break;

				case 'changeHTMLNodeTemplate':
					$htmlNodesManagement->change_template($do["nodes_data"]);

					break;

				case 'resetHTMLNodes':
					$htmlNodesManagement->reset();
					break;
				case 'removeHTMLNode':
					$htmlNodesManagement->remove_node($do["node_to_remove"]);
					break;


				case 'selectPosts':
					//mock posts selection here
					$postsSelectionManagement->select_posts($do["posts_selected"]);
					break;

				case 'changeOrder':
					//todo define new_order
					$postsSelectionManagement->changeOrder($do["new_order"]);

					break;

				case 'checkDB':
					$postsSelectionManagement->checkDB();
					break;

				case 'resetSelection':
					$postsSelectionManagement->reset();
					informClient('reset done');
					break;
				
				default:
					throwServerError('Task to handle not defined in nodesNetwork.php.');
					break;
			}
		}
	}

	function respNodesNetwork() {
		//check
		check_if_admin();

		//set
		$traffic = new NodesNetwork();
		$set_traffic = array($traffic, 'route');

		//run
		$post_data = array("nodes_action");
		handleAction($post_data, $set_traffic);

		//finish
		die();
	}
?>