(function($) {
  lazy_load_init();
  // if remove ,bind() method need add parentheses in lazy_load_init
  $('body').on('post-load', lazy_load_init);

  function lazy_load_init(){
    $('[data-lazy-src]').on( 'scrollin', { distance: 200 }, function(){
      lazy_load_image(this);
    });
  }

  function lazy_load_image(element){
    var $img = $(element),
        src = $img.attr('data-lazy-src'),
        srcset = $img.attr('data-lazy-srcset');

    if( !src || 'undefined' === typeof (src))
          return;

    $img.off('scrollin')
        .hide()
        .removeAttr('data-lazy-src data-lazy-srcset')
        .attr({
          'data-lazy-loaded': 'true',
          'srcset': srcset
        });

    element.src = src;

    $img.fadeIn();

  }
})(jQuery);