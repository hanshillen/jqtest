$(function() {

    var widgetNames = ["slider", "progressbar", "menubar", "button", "dialog", "checkbox",
                       "accordion", "tree", "carousel", "tabs", "tooltip", "autocomplete", "panel", "datepicker"];
    var loadedWidgets = {};
    var destroyableWidgets = ["slider"];

    var months= ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var lastMod = new Date(document.lastModified);
    $("#timeStamp").html(lastMod.getDate() + " " + months[lastMod.getMonth()] + " " + lastMod.getFullYear());

    // Allow tabs to be loaded based on urls
    var selectedTabId = 0
    var query = document.location.search;
    if (query) {
        var match = query.match("(\\?|&)tabId=([^&]+)(\\&|$)");
        console.log(match)
        if (match && match[2]) {
            if (!isNaN(match[2]))
                selectedTabId = match[2];
            else
                selectedTabId = jQuery.inArray(match[2], widgetNames);
            if (selectedTabId == -1)
                selectedTabId = 0;
        }
        console.log("selectedTabId: %S", selectedTabId);

    }

    $("#demoTabs").tabs({labelledBy: "tabsLbl", selected : selectedTabId});

    //TODO, make portable
    //if (selectedTabId === 0)

    setTimeout(function() {
    createSliders($("#slider"));
    }, 500);


    var carouselLoaded = accordionLoaded = treeLoaded = sliderLoaded = false;

    $('#demoTabs').bind('tabsshow', function(event, ui) {
        switch(ui.panel.id) {
            case "slider":
                createSliders(ui.panel);
            break;
            case "progressbar":
                createProgressBars(ui.panel);
            break;
            case "accordion":
                if (!accordionLoaded ) {
                    $("#sampleAccordion").accordion();
                    accordionLoaded = true;
                }
            break;
            case "tree":
                if (!treeLoaded ) {
                    $('#sampleTree').jstree({plugins : ["themes", "html_data", "ui", "hotkeys"]});
                    treeLoaded = true;
                }
            break;
            case "carousel":
                if (!carouselLoaded ) {
                    $('#mycarousel1').jcarousel({
                        animation: 500,
                        itemSelectedCallback : itemSelectedCallback
                    });
                    carouselLoaded = true;
                }
            break;
        }
    });

    function destroyInPanel(panel) {
        panel.find(".demoWidget").slider("destroy");

        var elements = panel.find(".demoWidget");
        var widgetName = "slider"
        var widgetId = 0;

        switch (widgetName) {
            case "slider":
                destroySliders(panel);
                break;
            default:
                if (typeof elements[widgetName] == "function")
                    elements[widgetName]("destroy");
                break;
        }
    }

    function createInPanel(panel) {
        var widgetId = 0;
        var widgetName = widgetNames[widgetId];
        if (!widgetName)
            return;
        var elements = panel.find(".demoWidget");
        switch (widgetName) {
            case "slider":
                createSliders(panel);
                break;
            case "progressbar":
                console.log("progressbar!!");
                createProgressBars(panel);
                break;
            default:
                if (typeof elements[widgetName] == "function")
                    elements[widgetName]();
                break;
        }

        loadedWidgets[widgetName] = true;
    }

    function toggleEnabledInPanel(panel, enable) {
        var elements = panel.find(".demoWidget");
        var widgetName = "slider"
        if (typeof elements[widgetName] == "function")
            elements[widgetName](enable ? "enable" : "disable");
    }


    function destroySliders(panel)  {
        panel.find(".fallback").show();
        panel.find("demoWidget").slider("destroy");
        panel.find(".sliderValue").hide();
    }

    function createSliders(panel)  {
        //single slider
            $(panel).find(".fallback").hide();

          $("#singleSlider1").slider({unittext : "MB",
              label : "price",
              unittext: "$",
              slide: function(event, ui) {
              updateSliderLabels(ui, ["#slider1Val"]);
                  },
              change : function(event, ui) {
                      updateSliderLabels(ui, ["#slider1Val"]);
                  }
          });

          $(panel).find(".sliderValue").show();

          updateSliderLabels({value : $("#singleSlider1").slider("value"), handle : $("#singleSlider1").find(".ui-slider-handle").eq(0)}, ["#slider1Val"]);
          updateSliderLabels({value : $("#singleSlider1").slider("value"), handle : $("#singleSlider1").find(".ui-slider-handle").eq(0)}, ["#slider1Val"]);

          // range slider
          var rangeSlider = $("#rangeSlider1")
          .slider({
              range: true,
              min: 0,
              max: 500,
              values: [75, 300],
              unittext: "$",
              label: "price range",
              slide: function(event, ui) {
              updateSliderLabels(ui, ["#slider2ValMin", "#slider2ValMax"]);
              },
              change : function(event, ui) {
                  updateSliderLabels(ui, ["#slider2ValMin", "#slider2ValMax"]);
              }
          });

          var sliderValues = rangeSlider.slider("values");
          updateSliderLabels({value : sliderValues[0], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(0)}, ["#slider2ValMin", "#slider2ValMax"]);
          updateSliderLabels({value : sliderValues[1], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(1)}, ["#slider2ValMin", "#slider2ValMax"]);
          // need to do this twice for some reason, va;ue is not properly positioned otherwise
          updateSliderLabels({value : sliderValues[0], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(0)}, ["#slider2ValMin", "#slider2ValMax"]);
          updateSliderLabels({value : sliderValues[1], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(1)}, ["#slider2ValMin", "#slider2ValMax"]);

          sliderLoaded = true;
    }

    function updateSliderLabels(ui, valueLabels) {
        if (!ui.values)
            ui.values = [ui.value];
        // need to be able to determine which of the handles actually changes
        var index = $.inArray(ui.value, ui.values);
        var myAlign = index == 0 ? "right" : "left";
        var atAlign = index == 0 ? "left" : "right";
            $(valueLabels[index])
                .position({
                    my: myAlign + " bottom",
                    at : atAlign + " top",
                    of: ui.handle,
                    })
                .text("$" + ui.value);
            return;
   }

    //menubar
    $(".menubar").menubar({isMenuBar : true});

        var progressUpdater;

    function createProgressBars(panel) {
        //progress bar
        $(panel).find('#progressTrigger').button()
            .click(function() {
                var progressBar = $("#sampleProgressBar")
                .progressbar({
                     value: 0,
                     labelledBy: "progressMsg"
                 });
                if (!$("#progressMsg").length)
                    progressBar.append("<p id='progressMsg'>Loading Files...</p>");
                var progressDialog = $("#progressDialog")
                .dialog({autoOpen : true,
                    modal : true,
                    title :  "progress",
                    resizable : false,
                    draggable : false,
                    dialogClass : "noCloseBtn",
                    width : 500,
                    beforeClose : function() {
                    if ($("#sampleProgressBar").progressbar('value') != 100)
                        return false;}
                })
                .append(progressBar);


                setTimeout(function() {
                    $("#sampleProgressBar").progressbar('value', 0);
                    progressUpdater = setInterval(function() {
                        if ($("#sampleProgressBar").progressbar('value') == 100) {
                            clearInterval(progressUpdater);
                            $("#progressDialog").dialog("close");
                            $('#progressTrigger').focus();
                        }
                        $("#sampleProgressBar").progressbar('value', $("#sampleProgressBar").progressbar('value') + 2);
                        }, 250);
                }, 100);
            });
    }

    //buttons
    $('#beginning').button({
        text: false,
        icons: {
            primary: 'ui-icon-seek-start'
        }
    });
    $('#rewind').button({
        text: false,
        icons: {
            primary: 'ui-icon-seek-prev'
        }
    });
    $('#play').button({
        text: false,
        icons: {
            primary: 'ui-icon-play'
        }
    })
    .click(function() {
        var options;
        if ($(this).text() == 'play') {
            options = {
                label: 'pause',
                icons: {
                    primary: 'ui-icon-pause'
                }
            };
        } else {
            options = {
                label: 'play',
                icons: {
                    primary: 'ui-icon-play'
                }
            };
        }
        $(this).button('option', options);
    });
    $('#stop').button({
        text: false,
        icons: {
            primary: 'ui-icon-stop'
        }
    })
    .click(function() {
        $('#play').button('option', {
            label: 'play',
            icons: {
                primary: 'ui-icon-play'
            }
        });
    });
    $('#forward').button({
        text: false,
        icons: {
            primary: 'ui-icon-seek-next'
        }
    });
    $('#end').button({
        text: false,
        icons: {
            primary: 'ui-icon-seek-end'
        }
    });
    $("#shuffle").button();
    $("#repeat").buttonset();

    // dialog
    $("#sampleDialog").dialog({close : function(e){$('#dialogTrigger').focus()} ,autoOpen : false, describedBy : "dialogDescription", modal : true,  buttons: { "Ok": function() { $(this).dialog("close"); } } });
    $('#dialogTrigger').button()
    .click(function() {
        $("#sampleDialog").dialog("open")
            .find(":input").eq(0).focus();
            return false;
        });

    $('#demoTabs > .ui-tabs-panel').each(function() {

        if (jQuery.inArray(this.id, destroyableWidgets))
            return;
        $(this)
            .prepend($("<button class='enabled'>Disable "+ this.id+"</button>").button().click(
                function(){
                    var btn = $(this);
                    if (btn.hasClass("enabled")) {
                        console.log("bah");
                        toggleEnabledInPanel(btn.closest(".ui-tabs-panel"), false);
                        btn.toggleClass("enabled").button("option", "label", btn.text().replace(/Disable/i, "Enable"));
                    }
                    else {
                        toggleEnabledInPanel(btn.closest(".ui-tabs-panel"), true);
                        btn.toggleClass("enabled").button("option", "label", btn.text().replace(/Enable/i, "Disable"));
                    }

                }))
        .prepend($("<button class='created'>Destroy "+ this.id+"</button>").button().click(
            function(){
                var btn = $(this);
                if (btn.hasClass("created")) {
                    destroyInPanel(btn.closest(".ui-tabs-panel"));
                    btn.toggleClass("created").button("option", "label", btn.text().replace(/Destroy/i, "Create"));
                }
                else {
                    createInPanel(btn.closest(".ui-tabs-panel"));
                    btn.toggleClass("created").button("option", "label", btn.text().replace(/Create/i, "Destroy"));
                }
            }));


    });


    //Checkboxes

        $("#checkbox").find(":checkbox").checkbox();

    // carousel

    function itemSelectedCallback(carousel, item, index) {
        item = $(item);
        var src = item.find("img").attr("src");
        var alt = item.find("img").attr("alt");
        if (src) {
            $("#viewerImg").attr("src", src);
        }
        if (alt) {
            $("#viewerImg").attr("alt", alt);
        }
    }


    // tabs demo

        $("#sampleTabs").tabs({labelledBy: "tabsDemoLbl"});


   // tooltip
        $("#button [title], #tooltip [title]").tooltip();
        $("<button/>").text("Show tooltips").button().toggle(function() {
            $(".toggleTooltips :ui-tooltip").tooltip("open");
        }, function() {
            $(".toggleTooltips :ui-tooltip").tooltip("close");
        }).appendTo("#tooltipButtonAnchor");

   // auto complete

    var availableTags = [
         "ActionScript",
         "AppleScript",
         "Asp",
         "BASIC",
         "C",
         "C++",
         "Clojure",
         "COBOL",
         "ColdFusion",
         "Erlang",
         "Fortran",
         "Groovy",
         "Haskell",
         "Java",
         "JavaScript",
         "Lisp",
         "Perl",
         "PHP",
         "Python",
         "Ruby",
         "Scala",
         "Scheme"
     ];
     $( "#tags-1" ).autocomplete({
         source: availableTags
     });
     // Autocomplete multiple

                          function split( val ) {
                              return val.split( /,\s*/ );
      }
      function extractLast( term ) {
          return split( term ).pop();
      }

      $( "#tags-2" )
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
          if ( event.keyCode === $.ui.keyCode.TAB &&
                  $( this ).data( "autocomplete" ).menu.active ) {
              event.preventDefault();
          }
      })
      .autocomplete({
          minLength: 0,
          source: function( request, response ) {
              // delegate back to autocomplete, but extract the last term
              response( $.ui.autocomplete.filter(
                  availableTags, extractLast( request.term ) ) );
          },
          focus: function() {
              // prevent value inserted on focus
              return false;
          },
          select: function( event, ui ) {
              var terms = split( this.value );
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push( ui.item.value );
              // add placeholder to get the comma-and-space at the end
              terms.push( "" );
              this.value = terms.join( ", " );
              return false;
          }
      });

      // Panel

      var panel = $("#panel1").panel();

      $("#panel-icons").toggle(function() {
          panel.panel("option", "icons", false);
      }, function() {
          panel.panel("option", "icons", $.ui.panel.prototype.options.icons);
      });

      $("#panel-disable").toggle(function() {
          panel.panel("disable");
      }, function() {
          panel.panel("enable");
      });

      $("#panel-destroy").toggle(function() {
          panel.panel("destroy");
      }, function() {
          panel.panel();
      });

      // Datepicker

      $( "#datepicker1" ).datepicker();


});


