<?php
add_theme_support( 'post-thumbnails' );

function sbl_prepare_rest($data, $post, $request){
	$_data = $data->data;
  // TODO: set another nexts but withing category, and load that from cookie
	$nextPost = get_adjacent_post(false, '', true );
	$prevPost = get_adjacent_post(false, '', false );
  $_data['category'] = get_the_category();

	$_data['next_post']['id'] = $nextPost->ID;
	$_data['previous_post']['id'] = $prevPost->ID;

	$_data['next_post']['slug'] = $nextPost ? basename(get_permalink($nextPost->ID)) : false;
	$_data['previous_post']['slug'] = $prevPost ? basename(get_permalink($prevPost->ID)) : false;

	$_data['next_post']['title'] = $nextPost ? get_the_title($nextPost->ID) : false;
	$_data['previous_post']['title'] =  $prevPost ? get_the_title($prevPost->ID) : false;

  $_data['next_post']['category'] =  $nextPost ? get_the_category($nextPost->ID) : false;
  $_data['previous_post']['category'] =  $prevPost ? get_the_category($prevPost->ID) : false;


	// Remove tags from Excerpts
	$excerpt = wp_strip_all_tags(get_the_excerpt($post->ID),false);
	unset( $_data['excerpt'] );
	$_data['excerpt']= $excerpt;

	$data->data = $_data;
	return $data;
}
add_filter('rest_prepare_post', 'sbl_prepare_rest', 12, 3);

// roughty 20 words in 160 characters
function sbl_excerpt_length( $length ) {
	 return 20;
}
add_filter( 'excerpt_length', 'sbl_excerpt_length', 999 );


function sbl_preview_link() {
    $slug = basename(get_permalink());
    $mydomain = home_url();
    $mydir = '/preview/';
    $mynewpurl = "$mydomain$mydir$slug";
    return "$mynewpurl";
}
add_filter( 'preview_post_link', 'sbl_preview_link' );



?>

