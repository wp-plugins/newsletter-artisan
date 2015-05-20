<?php

class postsSelectionManagementTest extends PHPUnit_Framework_TestCase {

	public function setUp() {
		$this->classInstance = new PostsSelectionManagement();
	}

	public function tearDown() {
		//at end of test
	}

	public function testCheckingIfClassnodesNetworkExist() {
		$this->assertTrue(class_exists('PostsSelectionManagement'));
	}

 	/**
     * @expectedException        ErrorException
     * @expectedExceptionMessage No theme was activated yet - function error in postsSelectionManagement.php
     */
	public function testExceptionHasRightMessage() {
		$this->classInstance->select_posts();
	}


}

?>