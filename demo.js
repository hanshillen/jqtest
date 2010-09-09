$(function() {
    $("#tabs").tabs({labelledBy: "tabsLbl"});


    //menubar
    $(".menubar").menu({isMenuBar : true});

    //single slider
    $("#slider").slider({unittext : "MB", 
        label : "price",
        unittext: "$",
        slide: function(event, ui) {
        updateSliderLabels(ui, ["#slider1Val"]);
            },
        change : function(event, ui) {
                updateSliderLabels(ui, ["#slider1Val"]);
            }
    });

    updateSliderLabels({value : $("#slider").slider("value"), handle : $("#slider").find(".ui-slider-handle").eq(0)}, ["#slider1Val"]);
    updateSliderLabels({value : $("#slider").slider("value"), handle : $("#slider").find(".ui-slider-handle").eq(0)}, ["#slider1Val"]);

    // range slider
    var rangeSlider = $("#slider-range")
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
   }
    
    var sliderValues = rangeSlider.slider("values");
    updateSliderLabels({value : sliderValues[0], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(0)}, ["#slider2ValMin", "#slider2ValMax"]);
    updateSliderLabels({value : sliderValues[1], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(1)}, ["#slider2ValMin", "#slider2ValMax"]);
    // need to do this twice for some reason, va;ue is not properly positioned otherwise
    updateSliderLabels({value : sliderValues[0], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(0)}, ["#slider2ValMin", "#slider2ValMax"]);
    updateSliderLabels({value : sliderValues[1], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(1)}, ["#slider2ValMin", "#slider2ValMax"]);
    var progressUpdater;

    //progress bar
    $('#progressTrigger').button()
        .click(function() {
            var progressBar = $("#progressbar")
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
                if ($("#progressbar").progressbar('value') != 100) 
                    return false;}
            })
            .append(progressBar);
            
            
            setTimeout(function() {
                $("#progressbar").progressbar('value', 0);
                progressUpdater = setInterval(function() {
                    if ($("#progressbar").progressbar('value') == 100) {
                        clearInterval(progressUpdater);
                        $("#progressDialog").dialog("close");
                        $('#progressTrigger').focus();
                    }
                    $("#progressbar").progressbar('value', $("#progressbar").progressbar('value') + 2);
                    }, 250);
            }, 100);       
        });
    
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
    $("#sampleDialog").dialog({autoOpen : false, describedBy : "dialogDescription", modal : true,  buttons: { "Ok": function() { $(this).dialog("close"); } } });
    $('#dialogTrigger').button()
    .click(function() {
        $("#sampleDialog").dialog("open")
            .find(":input").eq(0).focus();
        });
    
    //Checkboxes
    
        $("#tabs-6").find(":checkbox").checkbox();

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

	var carouselLoaded = false;
	var accordionLoaded = false;
	$('#tabs').bind('tabsshow', function(event, ui) {
	    if (ui.panel.id == "tabs-9" && !carouselLoaded ) {
	    	$('#mycarousel1').jcarousel({
	        	animation: 500,
	        	itemSelectedCallback : itemSelectedCallback
	    	});
	    	carouselLoaded = true;
	    }
	    else if (ui.panel.id == "tabs-7" && !accordionLoaded ) {
	    	$("#accordion").accordion();	
	    	accordionLoaded = true;
	    }
	});
	
	// Tree
	
	    $('#sampleTree').jstree({plugins : ["themes", "html_data", "ui", "hotkeys"]});
        
        $(".jstree-closed > a")
            .attr("aria-expanded", "false");
        $(".jstree-open > a")
            .attr("aria-expanded", "true");

	// tabs demo
        
        $("#tabs-demo").tabs({labelledBy: "tabsDemoLbl"});
});


