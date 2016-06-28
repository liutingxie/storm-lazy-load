(function( $, window, document, undefined ) {
  $.lazy_load = $.lazy_load || {};
  //global variable
 var lp = $.lazy_load;
  var body = document.body,
      $window = $(window),
      pollQueue = {},
      pollActive = 0,
      pollId,

      onScreen =  "scrollin",
      offScreen = "scrollout";

  var detect = function( element, distance, full ){
    if( element ){

      body || (body = document.body);
      var parentElement = element, // Clone the elem for use in our loop.
          elementTop = 0, // The resets the calculated elem top to 0.
          // Used to recalculate element.scrollTop. if body height changes.
          bodyHeight = body.offsetHeight,
          screentHeith = document.documentElement.clientHeight || body.clientHeight || 0, // Height of the screen.
          scrollTop = document.documentElement.scrollTop || body.scrollTop || 0, // How far the user scrolled down.
          elementHeight = element.offsetHeight || 0; // Height of the element.


      if( !element.scrollTop || element.StormBodyHeight !== bodyHeight ){

        // Loop through the offsetParents to calculate it.
        //
        if( parentElement.offsetParent ){
          do{
              elementTop += parentElement.offsetTop;
          }

          while( parentElement = parentElement.offsetParent );
        }

        // Set the custom property (elementTop) to avoid future attempts to calculate
        // the distance on this elem from the top of the page.

        element.stormScrollTop = elementTop;

        // Along the same lines, store the body height when we calculated
        // the elem's top.
        element.StormBodyHeight = bodyHeight;
      }

      // If no distance was given, assume 0.
      distance = distance === undefined ? 0 : distance;

      // If elem bottom is above the screen top and
      // the elem top is below the screen bottom, it's false.
      // If full is specified, it si subtracted or added
      // as needed from the element's height.
      return( !(element.stormScrollTop + (full ? 0 : elementHeight) < scrollTop - distance) && !(element.stormScrollTop + (full ? elementHeight : 0) > scrollTop + screentHeith + distance ));
    }
  };

  lp.poll = function(){
    //use clearTimeout method clear timer set with setCursor(auto)Timeout()
    //To be able use the clearTimeout(), must use global variable when creating the timeout method
    pollId && clearTimeout(pollId);
    pollId = setTimeout(function(){
      var element,
          elements,
          screenEvent,
          options,
          detected,
          i, l;

      for(screenEvent in pollQueue){
        elements = pollQueue[screenEvent];

        for(i = 0, l = elements.length; i < l; i++){
          options = elements[i];
          element = options.element;

          detected = detect(element, options.distance, options.full);

          if( screenEvent === offScreen ? !detected : detected ){
            if( !options.tr ){
              if( element[screenEvent] ){
                $(element).trigger(screenEvent);
                options.tr = 1;
              }
              else{
                elements.splice(i, 1);

                i--;
                l--;
              }
            }
          }
          else{
            options.tr = 0;
          }
        }
      }

    }, 0);
  };

  var removePoll = function(element, screenEvent){
    element[screenEvent] = 0;
  };

  var addPoll = function(element, options){
    var distance = options.px,
        full = options.full,
        screenEvent = options.evt,
        parent = window,
        detected = detect(element, distance, full),
        triggered = 0;
        element[screenEvent] = 1;

    if(screenEvent === offScreen ? !detected : detected){
      setTimeout(function(){
        $(element).trigger(screenEvent === offScreen ? offScreen :  onScreen);
      }, 0);

      triggered = 1;
    }

    pollQueue[screenEvent].push({
      element: element,
      px: distance,
      full: full,
      tr: triggered
    });


    if( !pollActive ){
      $window.on('scroll', lp.poll);

      pollActive = 1;
    }

  };

  pollQueue[onScreen] = [];
  $.event.special[onScreen] = {
    add: function(handleObj){
      var data = handleObj.data || {},
          element = this;

      if( !element[onScreen] ){
        addPoll(this,{
          px: data.distance,
          full: data.full,
          evt: onScreen
        });
      }
    },

    remove: function(handleObj){
     removePoll(this, onScreen);
    }
  };

  pollQueue[offScreen] = [];
  //this event extensions don't need run
  // $.event.special.scrollout = {
  //   add: function(handleObj){
  //     var data = handleObj.data || {},
  //         element = this;

  //     if( !element[offScreen] ){
  //       addPoll(this, {
  //         px: data.distance,
  //         full: data.full,
  //         evt: offScreen
  //       });
  //     }
  //   },

  //   remove: function(handleObj){
  //     removePoll(this, offScreen);
  //   }
  // }
})( jQuery, window, document );