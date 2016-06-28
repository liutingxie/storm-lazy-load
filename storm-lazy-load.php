<?php
/**
 * Plugin Name: Storm Lazy Load
 * Description: Create Lazy Load
 * Version: 1.0
 * License: GPL2
 */


class lazy_load{
  public function __construct(){
    add_action('init', array($this, 'init'));
  }
  public function init(){
    add_action('wp_enqueue_scripts', array($this, 'add_enqueue_script'));
    add_filter('the_content', array($this,'add_placeholders'));
    add_filter('post_thumbnail_html', array($this, 'add_placeholders'));

    //I want to replace video url,it's work, but replace wrong positions.
    //add_filter('wp_video_shortcode', array($this, 'add_video_placeholders'), 99, 5);

    //add_filter('get_avatar', array($this, 'add_placeholders'));
  }
  public function add_enqueue_script(){
    wp_enqueue_script('storm-lazy-load', plugins_url('/asset/js/lazy-load.js', __FILE__), array('jquery','storm-lazy-load-replace'), 1.0, true);
    wp_enqueue_script('storm-lazy-load-replace', plugins_url('/asset/js/lazy-load-replace.js', __FILE__), array('jquery'), 1.0, true);
  }

  public function add_placeholders($content){
    if(is_admin() || is_feed() || is_preview()){
      return $content;
    }

    if(false !== strpos($content, 'data-lazy-load')){
      return $content;
    }

    $placeholder_image = plugins_url('/asset/image/1x1.trans.gif', __FILE__);

    $content = preg_replace('#<img([^>]+?)src=[\'"]?([^\'"\s>]+)[\'"]?([^>]*)>#', sprintf('<img${1}src="%s" data-lazy-src="${2}"${3}>', $placeholder_image), $content);
    if(true == strpos($content, 'srcset')){
      $content = str_replace('srcset', 'data-lazy-srcset', $content);
    }

    if(true == strpos($content, 'iframe')){
      $matches = array();
      preg_match_all('#<iframe(.*?)></iframe>#is', $content, $matches);

      foreach ($matches[0] as $videoHtml) {
        $content = preg_replace('/iframe(.*?)src=/is', 'iframe$1src="'.$placeholder_image.'" data-lazy-type="iframe" data-lazy-src=', $videoHtml);
      }
    }

    //don't work, I don't know why
    // $matches = array();
    // preg_match_all('/<video[\s\r\n]([a<]+)video>(?!<noscript>|<\/noscript>)/is', $content, $matches);

    // foreach ($matches[0] as $videoHtml) {
    //   $content = preg_replace('/video(.*?)src=/is', 'video$1 src="'.$placeholder_image.'" data-lazy-type="video" data-lazy-src=', $videoHtml);
    // }

    return $content;
  }

  //still don't working
  // public function add_video_placeholders( $output, $atts, $video, $post_id, $library){

  //   $placeholder_image = plugins_url('/asset/image/1x1.trans.gif', __FILE__);
  //   $matches = array();
  //   preg_match_all('#<video(.*?)></video>#is', $output, $matches);

  //   foreach ($matches[0] as $videoHtml) {
  //     $output = preg_replace('/mp4(.+?)src=/is', 'mp4$1 src="'.$placeholder_image.'" data-lazy-type="video" data-lazy-src=', $videoHtml);
  //   }
  //   return $output;

  // }
}

new lazy_load();