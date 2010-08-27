/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */

(function( $ ) {

$.widget( "ui.progressbar", {
	options: {
		value: 0,
        label : "",
        labelledBy : ""
	},
	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this._valueMin(),
				"aria-valuemax": this._valueMax(),
				"aria-valuenow": this._value()
			});
        if (this.options.label !== "")
            this.element.attr("title", this.options.label);
        if (this.options.labelledBy !== "")
            this.element.attr("aria-labelledby", this.options.labelledBy);

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );
        if ($.support.highContrast) {
            this.valueDiv.css('right', 0 + "%");            
            this.valueTextDiv = $( "<span class='ui-progressbar-valuetext'>" 
                + this._value() + "</span>")
                .appendTo( this.element );
        }
        
		this._refreshValue();
	},

	destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();

		$.Widget.prototype.destroy.apply( this, arguments );
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		switch ( key ) {
			case "value":
				this.options.value = value;
				this._refreshValue();
				this._trigger( "change" );
				break;
		}

		$.Widget.prototype._setOption.apply( this, arguments );
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		if ( val < this._valueMin() ) {
			val = this._valueMin();
		}
		if ( val > this._valueMax() ) {
			val = this._valueMax();
		}

		return val;
	},

	_valueMin: function() {
		return 0;
	},

	_valueMax: function() {
		return 100;
	},

	_refreshValue: function() {
		var value = this.value();
		this.valueDiv
			[ value === this._valueMax() ? "addClass" : "removeClass"]( "ui-corner-right" )
			.width( value + "%" );
	      if ($.support.highContrast) {
	            this.valueDiv.css("right" , (100 - value) + "%");
	            this.valueTextDiv.text(value + "%");
	        }
	        else {
	            this.valueDiv
	                [ value === this._valueMax() ? "addClass" : "removeClass"]( "ui-corner-right" )
	                .width( value + "%" );
	        }
		this.element.attr( "aria-valuenow", value );
		this.element.attr( "aria-valuetext", value + "%" );
	}
});

$.extend( $.ui.progressbar, {
	version: "@VERSION"
});

})( jQuery );
