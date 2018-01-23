<?php
add_theme_support('post-thumbnails');
function siblings($sibling)
{
    $obj;
    $obj['id']       = $sibling->ID;
    $obj['slug']     = $sibling ? basename(get_permalink($sibling->ID)) : false;
    $obj['title']    = $sibling ? get_the_title($sibling->ID) : false;
    $obj['category'] = $sibling ? get_the_category($sibling->ID) : false;
    return $obj;
}
function sbl_prepare_rest($data, $post, $request)
{
    $_data             = $data->data;
    $categories        = get_the_category();
    $singleCatSlug     = $categories[0]->slug;
    $_data['category'] = $categories;
    $_data['singleCatSlug'] = $singleCatSlug;
    // TODO: set another nexts but withing category, and load that from cookie
    $nextPost               = get_next_post(false, '');
    $prevPost               = get_previous_post(false, '');
    $nextPostinCategory     = get_next_post(true, '');
    $previousPostinCategory = get_previous_post(true, '');
    $_data['next_post']                = siblings($nextPost);
    $_data['previous_post']            = siblings($prevPost);
    $_data['next_post_inCategory']     = siblings($nextPostinCategory);
    $_data['previous_post_inCategory'] = siblings($previousPostinCategory);
    // Remove tags from Excerpts
    $excerpt = wp_strip_all_tags(get_the_excerpt($post->ID), false);
    unset($_data['excerpt']);
    $_data['excerpt'] = $excerpt;
    $data->data = $_data;
    return $data;
}
add_filter('rest_prepare_post', 'sbl_prepare_rest', 12, 3);
// roughty 20 words in 160 characters
function sbl_excerpt_length($length)
{
    return 20;
}
add_filter('excerpt_length', 'sbl_excerpt_length', 999);


function sbl_preview_link()
{
    $slug      = basename(get_permalink());
    $id        = get_the_id();
    $mydomain  = home_url();
    $mydir     = '/preview/';
    $mynewpurl = "https://preview.sarah-beth.co.uk$mydir?p=$id";
    return "$mynewpurl";
}
add_filter('preview_post_link', 'sbl_preview_link');
