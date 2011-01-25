/*
 * jQuery UI Panel @VERSION
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Panel
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {

$.widget("ui.panel", {

    options: {
        icons: {
            header: "ui-icon-triangle-1-e",
            headerSelected: "ui-icon-triangle-1-s"
        }
    },

    _create: function() {
        this.element.addClass("ui-panel ui-widget ui-helper-reset");

        var self = this;
        this.headers = this.element
            .find("> li > :first-child,> :not(li):even")
            .addClass("ui-panel-header ui-helper-reset ui-state-default ui-corner-all")
            .bind("mouseenter.panel", function() {
                if (self.options.disabled) {
                    return;
                }
                $(this).addClass('ui-state-hover');
            })
            .bind("mouseleave.panel", function() {
                $(this).removeClass('ui-state-hover');
            })
            .bind("focus.panel", function() {
                $(this).addClass('ui-state-focus');
            })
            .bind("blur.panel", function() {
                $(this).removeClass('ui-state-focus');
            })
            .bind("click.panel", function(e) {
                if (self.options.disabled) {
                    return;
                }
                self.click($(this));
                return false;
            });
        this._createIcons();

        this.headers
            .next()
                .addClass("ui-panel-content ui-helper-reset ui-widget-content ui-corner-bottom")
                .hide();
    },

    destroy: function() {
        $.Widget.prototype.destroy.apply(this, arguments);
        this.element
            .removeClass("ui-panel ui-widget ui-helper-reset")
            .removeAttr("role");

        this.headers
            .unbind(".panel")
            .removeClass("ui-panel-header ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-corner-top")
            .removeAttr("role").removeAttr("aria-expanded").removeAttr("tabindex");

        this.headers.find("a").removeAttr("tabindex");
        this._destroyIcons();
        var contents = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-panel-content ui-panel-content-active");
    },

    _setOption: function(key, value) {
        $.Widget.prototype._setOption.apply(this, arguments);

        if (key == "icons") {
            this._destroyIcons();
            if (value) {
                this._createIcons();
            }
        }

    },

    _createIcons: function() {
        var o = this.options;
        if (o.icons) {
            $("<span/>").addClass("ui-icon " + o.icons.header).prependTo(this.headers);
            this.headers.filter(".ui-state-active").find(".ui-icon").removeClass(o.icons.header).addClass(o.icons.headerSelected);
            this.element.addClass("ui-panel-icons");
        }
    },

    _destroyIcons: function() {
        this.headers.children(".ui-icon").remove();
        this.element.removeClass("ui-panel-icons");
    },

    click: function(header) {
        header.toggleClass("ui-state-active ui-corner-top ui-corner-all")
            .find(".ui-icon").toggleClass(this.options.icons.headerSelected).toggleClass(this.options.icons.header);
        header.next().toggleClass("ui-panel-content-active").slideToggle("fast");
    }
});

}(jQuery));