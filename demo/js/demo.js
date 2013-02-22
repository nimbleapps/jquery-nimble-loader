$(document).ready(function(){

 
  /*********************************************************************************************************************
   * INITIALISATION
   * Define some sets of params
   * Init the global param for the plugin
   ********************************************************************************************************************/

   // Params example 1
  var params1 = {
    loaderClass   : "loading_bar_1",
    debug         : true,
    speed         : 'fast',
    hasBackground : false,
    zIndex        : 99
  };

  // Params example 2
  var params2 = {
    loaderClass        : "loading_bar_body",
    debug              : true,
    speed              : 700,
    needRelativeParent : false,
    hasBackground      : true,
    zIndex             : 999,
    backgroundColor    : "#34383e",
    backgroundOpacity  : 1
  };

  // Overwrite the default params : nimbleLoader will use param1 as default params
  $.fn.nimbleLoader.setSettings(params1);

  /*********************************************************************************************************************
   * EXAMPLE 1 : SIMPLE EXAMPLE
   * Activate loading bar with "show" button
   * Deactivate by "hide" button
   ********************************************************************************************************************/

  var changeNbCall = function(action){
    var $nbCall = $("#nb_call");
    var nbCall  = parseInt($nbCall.html());
    if(!isNaN(nbCall)){
      if(action === "up"){nbCall += 1;}
      else if(action === "down"){
        if(nbCall > 0){nbCall -= 1;}
      }
    }else{nbCall = 0;}
    $nbCall.html(nbCall);
  };

  // Init button of loader
  $("#loader1 .showLoader").click(function(){
    changeNbCall("up");
    $("#loading1").nimbleLoader("show"); // No param is specified, it will use those we set during initialisation (param1)
  });
  $("#loader1 .hideLoader").click(function(){
    changeNbCall("down");
    $("#loading1").nimbleLoader("hide");
  });


  /*********************************************************************************************************************
   * EXAMPLE 2 : AJAX REQUEST
   * Perform a search on Wikipedia
   ********************************************************************************************************************/
  $("#wikiSearchBtn").click(function(){
    var $loaderBox = $(this).prevAll(".nimbleLoader");
    var toSearch   = $("#wiki_search").val();

    // Empty the loaderBox
    $loaderBox.empty();

    // If there something in the text field
    if(toSearch != ""){

      // Show the loading bar
      $loaderBox.nimbleLoader("show");

      // Next we send the request performing the search on wikipedia
      $.ajax({
        url         : "http://fr.wikipedia.org/w/api.php",
        dataType    : "jsonp",
        data     : {
          action: "opensearch",
          search: toSearch,
          format: "json"
        },
        success     : function(request){
          if(request[1] !== undefined){
            $loaderBox.append("<strong>Results for '"+request[0]+"'</strong>");
            if($(request[1]).length > 0){
              $loaderBox.append("<ul></ul>");
              $(request[1]).each(function(){
                $loaderBox.find("ul").append("<li>"+this+"</li>");
              });
            }
            else{
              $loaderBox.html("<p>no result found for '"+$("#wiki_search").val()+"'</p>");
            }
          }
        },
        error       : function(request){
          $loaderBox.append("<p> Error "+request.responseText+"</p>");
        },
        complete    : function(){
          $loaderBox.nimbleLoader("hide");
        }
      });
    }
    else{
      $loaderBox.append("<p>Search not performed</p>");
    }
  });



  /*********************************************************************************************************************
   * EXAMPLE 3 : COUNTER EXAMPLE
   ********************************************************************************************************************/
  $("#btnCount").click(function(){
    $(this).attr('disabled', 'disabled');

    // LoaderBox is the element which will receive the loading bar
    var $loaderBox = $(this).prevAll(".nimbleLoader");
    var counter   = 1;
    var countUpTo = $("#counter").val();

    // Empty the box
    $loaderBox.empty();

    // Add the span which will display the counter
    $loaderBox.append("<span id='counterSpan'></span>");

    // Define count function : count and hide loading bar when finished
    var countFct = function (){
      if(counter <= countUpTo){
        setTimeout(function(){
          $loaderBox.find("#counterSpan").html(counter);
          counter += 1;
          countFct();
        }, 1000);
      }
      else{
        // When counter has finished, we hide the loading bar
        $loaderBox.nimbleLoader("hide");
        $("#btnCount").attr('disabled', '');
      }
    };

    // Show the loading bar before beginning counting
    $loaderBox.nimbleLoader("show");

    // Call count function
    countFct();

  });



  /*********************************************************************************************************************
   * EXAMPLE 4 : SIMULATE LOADING ON THE PAGE
   ********************************************************************************************************************/
  function hideGlobalLoader(){
    $("body").nimbleLoader("hide");
  }

  $("#bodyLoader").click(function(){
    $("body").nimbleLoader("show", params2);
    setTimeout(hideGlobalLoader, 2000);
  });


});


