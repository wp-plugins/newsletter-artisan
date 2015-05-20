<?php

class nodesNetworkTest extends PHPUnit_Framework_TestCase {

	public function setUp() {
		$this->classInstance = new NodesNetwork();
	}

	public function tearDown() {
		//at end of test
	}

	public function testCheckingIfClassnodesNetworkExist() {
		$this->assertTrue(class_exists('NodesNetwork'));
	}

	public function testCheckingIfClasspostsSelectionManagementExist() {
		$this->assertTrue(class_exists('PostsSelectionManagement'));
	}

	public function testCheckingIfClasspostsUIExist() {
		$this->assertTrue(class_exists('PostsUI'));
	}

	public function testIfRestFunctionExist() {
		$this->assertTrue(function_exists('respNodesNetwork'));
	}

 	/**
     * @expectedException        ErrorException
     * @expectedExceptionMessage Task to handle not defined in nodesNetwork.php.
     */
	public function testExceptionHasRightMessage() {
		$mocReq = array("route"=>"should_throw_error");
		$this->classInstance->route($mocReq);
	}

}

?>