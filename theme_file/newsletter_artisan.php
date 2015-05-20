<?php

    /**
     * Template Name: Newletter Artisan
     * Description: A wordpress template for Newsletter Artisan only. Please do not use it for any other purposes.
     */

    /* silence is gold */
 
    $o = get_option('newsletter_artisan', array());
    if (!empty($o["plugin_dir"])) {
        include( $o["plugin_dir"] . '/app/newsletter_controller/NewsletterController.php' );
    } else {
        trigger_error('please visit Artisan page in admin panel first!');
    }

?>