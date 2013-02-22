/**
 * nimbleLoader 2.0 - Display loading bar where you want with ease
 * Version 2.0
 * @requires    jQuery v1.7.1
 * @description Display a loading bar in whatever block element you want
 *
 *
 ***********************************************************************************************************************
 *                                                                                                          Use case ? *
 ***********************************************************************************************************************
 *
 * Most of the time the nimbleLoader is used when sending ajax request, to warn users that there is something
 * happening in the page :
 * - A form submission is being performed
 * - Update a block content by getting information with ajax request
 * - Upload / Download a file
 * - ...
 *
 * Limitations :
 * - nimbleLoader shouldn't be use on an element with the css "position" property set to "fixed" or "absolute"
 * - nimbleLoader could impact the display of absolute element contained in the target element if the target element
 *   become the first relative parent to the absolute element.
 *
 ***********************************************************************************************************************
 *                                                                                                  How to configure ? *
 ***********************************************************************************************************************
 *
 * 1- Choose your params
 *
 *         |  Type / Value accepted   |  Name                 |              |  Default value         | Description
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @option |  String                  |  loaderClass          |  (optional)  |  default:"loading_bar" | CSS class for the element which will display your loading bar
 * @option |  Numeric                 |  zIndex               |  (optional)  |  default:undefined     | value of the z-index css property of the loading bar if you need to handle it.
 *         |                          |                       |              |                          This can be useful if you have loading bars on top of the other in a page
 * @option |  Boolean                 |  debug                |  (optional)  |  default:false         | useful to display debug info
 * @option |  String/Numeric          |  speed                |  (optional)  |  default:"fast"        | The speed you want tour loading bar to appear/disappear (numeric or 'slow', 'fast'...)
 * @option |  String/Numeric          |  needPositionedParent |  (optional)  |  default:true          | Automatically set the CSS property "position" of the loading bar parent to "relative"
 * @option |  Boolean                 |  hasBackground        |  (optional)  |  default:false         | If true will add a grey background to the loader
 * @option |  css color               |  backgroundColor      |  (optional)  |  default:"black"       | Will decide the background color   (only useful when hasBackground is true)
 * @option |  0< opt =<1              |  backgroundOpacity    |  (optional)  |  default:0.5           | Will decide the background opacity (only useful when hasBackground is true)
 * @option |  String                  |  display              |  (optional)  |  default:undefined     | If "inline" the loading bar will be displayed as an inline element in the targeted container
 * @option |  String "left" / "right" |  floatPosition        |  (optional)  |  default:undefined     | Will decide the floating position if display set to "inline"
 * @option |  function                |  callbackOnHiding     |  (optional)  |  default:undefined     | Will be executed when nimbleLoader hide itself, when the fadeOut is done
 *
 *    Example : 
 *    var params = {
 *      loaderClass        : "loading_bar",
 *      debug              : false,
 *      speed              : 'fast',
 *      needPositionedParent : true
 *    }
 *
 * 2- Set your params
 *
 *    2.1 Global way
 *      $.fn.nimbleLoader.setSettings(params);
 *
 *    2.2 Specific way
 *      $("#myDiv").nimbleLoader("show", otherParams);
 *
 * 3- Don't forget to set the css of your loading bar : see the demo to have an example (style/loader.css)
 * 
 *
 * 
 ***********************************************************************************************************************
 *                                                                                                        How to use ? *
 ***********************************************************************************************************************
 *
 * => Showing a loading bar in <div id="myDiv"></div>
 * $("#myDiv").nimbleLoader("show");
 *
 * => Hiding the loading bar
 * $("#myDiv").nimbleLoader("hide");
 *
 */

if(jQuery)(function($){
  
  // Extend JQuery function : adding nimbleLoader
  $.extend($.fn,{
    
    nimbleLoader: function(method, options){
      
      /*************************************************************************
       *  Plugin Methods
       ************************************************************************/

      // Clone the global settings. $.extend is needed : we extend a new object with global settings
      var settings = $.extend( true, {}, $.fn.nimbleLoader.settings);

      // Catch settings given in parameters

      if(options){ jQuery.extend(settings, options); }

      // Function to init the loader
      function init($nimbleLoader, settings){
        var loader = new LoadingHandlerGenerator($nimbleLoader, settings);
        $nimbleLoader.data("loader", loader);
      }

      // Function to show the loading bar
      var show = function(){

        return this.each(function(){
          var $nimbleLoader = $(this);
          if($nimbleLoader.data("loader") !== undefined){
            var loader = $nimbleLoader.data("loader");
            loader.showLoading();
          }
          else{
            init($nimbleLoader, settings);
            $nimbleLoader.nimbleLoader('show');
          }
        });
      };

      // Function to hide the loading bar
      var hide = function(){
        return this.each(function(){
          var $nimbleLoader = $(this);
          if($nimbleLoader.data("loader") !== undefined){
            var loader = $nimbleLoader.data("loader");
            loader.hideLoading();
          }
        });
      };

      var methods = {
        show         : show,
        hide         : hide
      };
      
      /*************************************************************************
      *  Execution when calling .nimbleLoader()
      ************************************************************************/
      if(methods[method]){
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1));
      }
      else if(!method){
        return methods.show.apply(this , Array.prototype.slice.call( arguments, 1));
      }
      else{
        if(window && window.console){
          console.log("[jquery.nimble.loader] -> no method '"+method+"' to apply ");
        }
        return false;
      }

      /**
       * Closure function which define a loading bar element
       */
      function LoadingHandlerGenerator($parentSelector, params){

        /**
         * Vars init
         * $loadingBar              : the loading bar JQuery element
         * debug                    : debug option to display in console how many times the loading bar has been called
         * speed                    : animation speed when showing/hiding the loading bar
         * needPositionedParent     : true if your loader has an absolute position : so you need its parent relative
         * previousCssPosition      : store the initial position (string) of the loader parent when "needPositionedParent" is true
         * countNbCall              : the counter to count the number of time the loader has been called
         * nbLoadingElements        : counter of the number of HTML elements involved (1 -only the loading bar- or 2 -the loading bar + the background-)
         */

        var $loadingBar;
        var debug                     = params.debug;
        var speed                     = params.speed;
        var needPositionedParent      = params.needPositionedParent;
        var previousCssPosition       = "";
        var countNbCall               = 0;
        var nbLoadingElements         = 0;
        var waitForAnimation          = {
          isAnimated  : 0, // the number of animated elements, - 0 meaning then no animation
          callStack   : []
        };


        // Init the loader : set html and place it
        function initLoading(){

          // If the loader doesn't exists, we create and init it
          if(!$loadingBar){

            // Define loading bar element
            var $loader = $('<div></div>').addClass(params.loaderClass);
            nbLoadingElements = 1;

            // If there is a background, we add it the loadingBar selector
            // and increase the nbLoadingElements value
            if (params.hasBackground) {
              nbLoadingElements++;
              var opacity           = params.backgroundOpacity;
              var $backgroundLoader = $('<div></div>').css({
                top                : 0,
                left               : 0,
                position           : "absolute",
                display            : "none",
                height             : "100%",
                width              : "100%",
                "background-color" : params.backgroundColor,
                "opacity"          : opacity,
                filter             : "alpha(opacity="+Math.floor(100*opacity)+")" // This is for IE7 and IE8
              });
              $loadingBar = $backgroundLoader.add($loader);
            }else{
              $loadingBar = $loader;
            }

            // Set the display as inline if specified in the option
            if (params.display == "inline") {
              if(params.loaderImgUrl != undefined){
                $loadingBar.css("display", params.display);
                $loadingBar.append("<img src='"+params.loaderImgUrl+"' />");

                // Look at the floatPosition
                if(params.floatPosition && (params.floatPosition == "right" || params.floatPosition == "left")){
                  $loadingBar.css("float", params.floatPosition);
                }

              }
              else{
                if(window && window.console){
                  console.log("[jquery.nimble.loader] -> loaderImgUrl should be defined when 'display' = 'inline'" );
                }
              }
            }

            // Set the z-index param if possible
            if (params.zIndex) {
              $loadingBar.css("z-index", params.zIndex);
            }

            // Prepend the loading bar in its parent
            if($parentSelector !== undefined && $parentSelector.length){
              $parentSelector.prepend($loadingBar);
            }

            // Set the css "position" property as "relative" of the loader if needed (we need it if its not positioned yet)
            if(needPositionedParent){
              if($parentSelector.css("position") === "relative" || $parentSelector.css("position") === "absolute"){
                // We need to know is nimbleLoader parent is already relative, that we can keep this css property when hiding the nimbleLoader
                previousCssPosition = $parentSelector.css("position");
              }
              else{
                $parentSelector.css("position", "relative");
              }
            }
          }
        }

        // Log counter element in the loading bar : useful to show the number of time a loading bar has been call
        function logCounter(nbCall){
          if(window && window.console){
            var idAttr    = $parentSelector.attr("id");
            var classAttr = $parentSelector.attr("class");
            var params    = [];
            if(idAttr    != ""){params.push("#"+idAttr);}
            if(classAttr != ""){params.push("."+classAttr);}
            console.log("[jquery.nimble.loader] -> $("+params.join(" ")+").logCounter : "+nbCall);
          }
        }

        // Decrease the call counter and change the debug display if needed
        function decreaseCounter(){
          var ret = -1;
          if(countNbCall > 0){
            countNbCall--;
            ret = countNbCall;
          }
          if(debug){logCounter(ret);}
          return ret;
        }

        // Increase the call counter and change the debug display if needed
        function increaseCounter(){
          countNbCall++;
          if(debug){logCounter(countNbCall);}
          return countNbCall;
        }

        // Check if there is an action to do in the callStack and do the one of the top of the stack
        function callStack(){
          if(waitForAnimation.callStack.length > 0){
            if(waitForAnimation.isAnimated === 0) {
              var actionToDo = waitForAnimation.callStack.pop();

              if(actionToDo == "hideLoading"){
                processHide();
              }
              else if(actionToDo == "showLoading"){
                processShow();
              }
            }
          }
        }

        function showLoading() {
          unshiftAction("showLoading");
        }
        function hideLoading() {
          unshiftAction("hideLoading");
        }

        function unshiftAction(action){
          waitForAnimation.callStack.unshift(action);
          callStack();
        }

        // Show the loading bar element
        function processShow(){
          if(increaseCounter() == 1) { // Check if we have to show the loader it's the first
            initLoading();

            // We set a param to know that the animation to hide has begin
            waitForAnimation.isAnimated = nbLoadingElements;
            $loadingBar.fadeIn(speed, function(){

              // We set a param to know that the animation to show is finished
              waitForAnimation.isAnimated--;

              // During destroying, calls can be made to show the loader. So we let's the loader disappear and then we show it again
              callStack();

            });
          }
          else{
            callStack();
          }
        }

        // Hide the loading bar element
        function processHide(){
          
          // Check if we have to destroy the loader (it happens when the counter is equal to 0)
          if( decreaseCounter() === 0){ // If countNbCall == 0 decreaseCounter() returns -1

            // We set a param to know that the animation to hide has begin
            waitForAnimation.isAnimated = nbLoadingElements;

            // We animate the loader to make it disappear
            $loadingBar.fadeOut(speed, function(){
              // This will be called as many times as there are elements in the $loading element
              // We set a param to know that the animation to hide is finished
              waitForAnimation.isAnimated--;

              // We destroy the loader element
              $(this).remove();

              // Reset the initial position of the loader parent
              $parentSelector.css("position", previousCssPosition);

              // If all loaders have been destroyed, we reset the $loadingBar variable
              if (waitForAnimation.isAnimated === 0) {
                $loadingBar = undefined;
              }

              // If a callback is defined, we call it
              if(params.callbackOnHiding && typeof(params.callbackOnHiding) === "function"){
                params.callbackOnHiding();
              }

              // During destroying, calls can be made to show the loader. So we let's the loader disappear and then we show it again
              callStack();
            });
          }
          else{
            callStack();
          }
        }

        // Body of the closure function
        return  {
          showLoading : showLoading,
          hideLoading : hideLoading,
          init        : initLoading
        };
      }
    }
  });

  $.extend($.fn.nimbleLoader,{
    settings:{
      loaderClass          : "loading_bar",
      callbackOnHiding     : undefined,
      debug                : false,
      speed                : 'fast',
      needPositionedParent : true,
      hasBackground        : false,
      backgroundColor      : "black",
      backgroundOpacity    : 0.5,
      display              : undefined,
      floatPosition        : undefined
    },
    setSettings: function(options){
      $.extend($.fn.nimbleLoader.settings, options);
    }
  });

})(jQuery);


