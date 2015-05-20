<?php

class postsUITest extends PHPUnit_Framework_TestCase {  

	public function setUp() {
		$this->postsUIInstance = new postsUI();
	}

	public function tearDown() {
		//at end of test
	}

	public function testCheckingIfClassExist() {
		$classExists = class_exists('postsUI');
		$this->assertTrue($classExists);
	}

	public function testIfAllPostsIsArray() {
		$this->assertTrue(is_array($this->postsUIInstance->allPosts));
	}

	public function testIfNewsletterLinkIsString() {
		$this->assertTrue(is_string($this->postsUIInstance->newsletterLink));
	}

	public function testIfNewsletterLinkContainsCharacters() {
		//todo - search db
		$this->assertTrue(true);
	}

	public function testIfInterfaceExists() {
		$this->assertTrue(interface_exists('IpostsUI'));
	}
}

?>