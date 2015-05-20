<?php

$baseAppPath = dirname(__FILE__) . '/../';
require_once($baseAppPath . 'util/util.php');

class ThemesManagement {
    public function getThemes () {
        $o = get_option('newsletter_artisan');

        if (isset($o['themes'])) {

            echo json_encode($o['themes']);
        } else {
            //server validation - client side validation shouldn't allow
            //this condition
            app_error("This theme does not exist - client validation error");
        }
    }

    public function getActiveTheme () {
        $o = get_option('newsletter_artisan');
        $themes = $o['themes'];

        if (isset($themes)) {

            foreach($themes as $theme) {
                if ($theme["active_theme"]) {
                    return $theme;
                }
            }

        } else {
            //server validation - client side validation shouldn't allow
            //this condition
            app_error("This theme does not exist - client validation error");
        }
    }

    public function deleteAllThemes () {
        $o = get_option('newsletter_artisan');

        $o['themes'] = array();
        update_option('newsletter_artisan', $o );
        echo 'all themes deleted';
    }
}

?>