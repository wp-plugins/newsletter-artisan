<?php

class nodeTest extends PHPUnit_Framework_TestCase {

	public function setUp() {
		$this->classInstance = new Node(array(), "wp_post_type");
	}

	public function tearDown() {
		//at end of test
	}

	public function testCheckingIfClassNodeExist() {
		$this->assertTrue(class_exists('Node'));
	}
}

?>