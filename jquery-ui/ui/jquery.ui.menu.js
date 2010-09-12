/*
 * jQuery UI Menu @VERSION
 * 
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Menu
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {

$.widget("ui.menu", {    
    
    _menuOpen : false,
    _menuExists : false,
    
    _create: function() {    
    
        var self = this;
        
        if (self.options.isMenuBar) {
            this.element.wrap("<div class='ui-widget ui-menubar ui-widget-content ui-widget-header'></div>");
            this.element.find("ul").menu();
            
        }
        this.element
            .addClass(self.options.isMenuBar ? "ui-menubar-nav ui-helper-reset ui-helper-clearfix": "ui-menu ui-widget ui-widget-content ui-helper-hidden")
            .attr({
                role: self.options.isMenuBar ? "menubar" :  "menu",
                "aria-activedescendant": "ui-active-menuitem"
            })
            
        this.refresh();
        
        if (!this.options.input) {
            this.options.input = this.element;//.attr("tabindex", 0);
        }
        
        this.options.input.bind("keydown.menu", function(event) {
            var subMenu, parentMenu, rootItem, newItem;
            switch (event.keyCode) {
            case $.ui.keyCode.PAGE_UP:
                self.previousPage();
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
            case $.ui.keyCode.PAGE_DOWN:
                self.nextPage();
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
            case $.ui.keyCode.UP:
                if (self.isMenuBarItem(event.target))
                    break;
                self.previous();
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
            case $.ui.keyCode.RIGHT:
                if (self.isMenuBarItem(event.target))  { 
                    self.next(event)
                }
                else {
                    subMenu = $(event.target).next("ul");
                    if (subMenu.length) {
                        if (!subMenu.is(":visible"))
                            subMenu.menu().show()
                        self.openSubMenu($(event.target).parent());
                        subMenu.menu("activate",  event, subMenu.children(":first"));  
                    }
                    else {
                        rootItem = $(event.target).closest(".ui-menubar-item");
                        newItem = rootItem.next(".ui-menubar-item");
                        if (!newItem.length)
                            newItem = rootItem.siblings('.ui-menubar-item:first'); 
                        newItem.parent().menu("activate", event, newItem); 
                        newItem.children(".ui-menu").menu("show", newItem);
                        newItem.children(".ui-menu").menu("activate", event, newItem.children("ul").children(":first"));
                    }
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
                
            case $.ui.keyCode.LEFT:
                if (self.isMenuBarItem(event.target)) {
                    self.previous(event)
                }
                else {
                    parentMenu = $(event.target).closest(".ui-menu")
                    if (parentMenu.length && parentMenu.parent().parent().is(":not(.ui-menubar-nav)") ) {
                        parentMenu.menu("activate",  event, parentMenu.prev().parent());
                        $(event.target).closest(".ui-menu").menu("hide");
                    }
                    else {
                        rootItem = $(event.target).closest(".ui-menubar-item");
                        newItem = rootItem.prev(".ui-menubar-item");
                        if (!newItem.length)
                            newItem = rootItem.siblings('.ui-menubar-item:last'); 
                        newItem.parent().menu("activate", event, newItem); 
                        newItem.children(".ui-menu").menu("show", newItem);
                        newItem.children(".ui-menu").menu("activate", event, newItem.children("ul").children(":first"));
                    }
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
            case $.ui.keyCode.DOWN:
                if (self.isMenuBarItem(event.target)) {
                    subMenu = $(event.target).next("ul");
                    self.openSubMenu($(event.target).parent());
                    subMenu.menu("activate",  event, subMenu.children(":first"));
                }
                else {
                    self.next();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
                break;
            case $.ui.keyCode.ENTER:
                self.select(event);
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
                
            case $.ui.keyCode.ESCAPE:
                parentMenu = $(event.target).closest(".ui-menu")
                if (parentMenu.length) {
                    parentMenu.menu("activate",  event, parentMenu.prev().parent());
                    $(event.target).closest(".ui-menu").menu("hide");
                }
                else {
                    //switch main menus
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                break;
            }
        });
    },
    
    destroy: function() {
        // TODO implement destroy
        $.Widget.prototype.apply(this, arguments);
    },
    
    refresh: function() {
        var self = this;
        
        var items = this.element.children("li:not(.ui-menu-item):has(a)")
            .addClass(this.options.isMenuBar ? "ui-menubar-item" : "ui-menu-item")
            .attr("role", "presentation");
        
        items.children("a")
            //.addClass("ui-corner-all")
            .attr("tabindex", -1)
            .attr("role", "menuitem")
            // mouseenter doesn't work with event delegation
            
            .mouseenter(function( event ) {
                self.openSubMenu($(this).parent());
                self.activate( event, $(this).parent(), true );
            })
            
            .mouseleave(function() {
                //self.deactivate();
            });
    

        
        if (self.options.isMenuBar) {
            this.active = self.element.children(":first").eq(0); 
            self.element.find("ul").hide().attr('aria-hidden', 'true');
            
            self.element.find("a").each(function(i) {
                //All items found in structure
                if (i == 0)
                    $(this).attr("tabindex", "0");
                
                $(this)
                .wrapInner('<span>')
                .click(function(event) {
                    event.preventDefault();
                    var item = $(this);
                    var menu = item.next("ul");
                    
                    if (menu.length == 0) { 
                        self.select(event);
                        return;
                    }
                    menu.menu("toggle", item);
                    return false;
                });
                var menu = $(this).next("ul");
                if (menu.length > 0) {
                    //all items with submenus
                    var isTopLevel = $(this).parent().parent().is(".ui-menubar-nav");
                    var isVertical = !isTopLevel; //TODO: add support for different orientations
                    var subIndicator = jQuery.support.highContrast ? (isVertical ? "&nbsp;&#8594;" : "&nbsp;&#8595;") : "";  
                    $(this).append("<span class='ui-icon ui-icon-triangle-1-" + (isTopLevel ? "s" : "e") + "' >" + subIndicator + "</span>")

                        .attr('aria-haspopup', 'true');
                    menu.attr('aria-expanded', 'false');
                    
                    if (isTopLevel)
                        $(this).addClass("ui-state-default")
                }
            });
        }
        
        
        // don't refresh list items that are already adapted
        
        items.filter(":has(ul)").each(function(i) {
            var showTimer, hideTimer;
            
            $(this).find("a:eq(0)").hover(
                function() {    
                    clearTimeout(hideTimer);
                    var subList = $(this).next();
                    
                    showTimer = setTimeout(function(){
                        subList.show().attr('aria-expanded', 'true');    
                    }, 50);
                },
                
                function() {
                    clearTimeout(showTimer);
                    var subList = $(this).next();
                    hideTimer = setTimeout(function(){ 
                        subList.hide().attr('aria-expanded', 'false');
                    }, 100);
                }
            );
            
            $(this).find('ul a').hover(
            function(){
                clearTimeout(hideTimer);
                //if ($(this).parents('ul').prev().is('a.fg-menu-indicator')) {
                  //  $(this).parents('ul').prev().addClass(options.flyOutOnState);
                //}
            },
            function(){
                hideTimer = setTimeout(function(){
                    //allSubLists.hide();
                    //container.find(options.flyOutOnState).removeClass(options.flyOutOnState);
                }, 150);    
            }
        );
        
        });
    },

    isMenuBarItem : function(item) {
        return $(item).parent().parent().is(".ui-menubar-nav");
    },
    
    activate: function( event, item, noFocus ) {
        item.siblings().find("ul").hide().find(".ui-state-hover").removeClass("ui-state-hover");
        
        this.deactivate();
        if (this.hasScroll()) {
            var offset = item.offset().top - this.element.offset().top,
                scroll = this.element.attr("scrollTop"),
                elementHeight = this.element.height();
            if (offset < 0) {
                this.element.attr("scrollTop", scroll + offset);
            } else if (offset > elementHeight) {
                this.element.attr("scrollTop", scroll + offset - elementHeight + item.height());
            }
        }
        this.active = item.eq(0)
            .children("a")
                .addClass("ui-state-hover")
                .attr("id", "ui-active-menuitem")
            .end();
        //this._trigger("focus", event, { item: item });
        if (!noFocus)
            item.children("a").eq(0).focus();
    },

    openSubMenu : function(item) {
        var subMenu = item.children("ul").eq(0);
        if (item.has("ul").length > 0) {
            subMenu.menu("show", item.children("a").eq(0));
            
        }
    },
    
    deactivate: function(event) {
        if (!this.active) { return; }

        this.active.children("a")
            .removeClass("ui-state-hover")
            .removeAttr("id");
        
        this._trigger("blur");
        this.active = null;
    },

    show: function(caller) {
        var menu = this.element;
        $(":ui-menu").not(menu).not(menu.parents()).menu("hide");
        //TODO: include more specific orientation options here
        var isHorizontal = menu.parent().parent().is(".ui-menubar-nav");
        
        var myPosition = "left top";
        var atPosition =  isHorizontal ? "left bottom" : "right top";
        var posOffset = isHorizontal ? "0 0" : "-1 0";
        menu.attr('aria-expanded', 'true')
        .attr('aria-hidden', 'false')
        .show().css({ left:0, top: 0 }).position({
            my: myPosition,
            at: atPosition,
            of: caller,
            offset: posOffset
        });
        
        $(document).bind("click.menubar", function(event) {
            if ($(event.target).closest(".ui-menu")[0] == menu[0]) {
                return;
            }
            $(this).unbind(".menubar");
            menu.hide();
        });
    },
    
    hide: function(caller) {
           this.element.hide()
            .attr('aria-expanded', 'false')
            .attr('aria-hidden', 'true')
            .find("ui-state-hover").removeClass("u-state-hover");
    },
    
    toggle: function(caller) {
        if (this.element.is(":visible")) 
            this.hide(caller);
        else 
            this.show(caller);

    },
    
    next: function(event) {
        this.move("next", ".ui-menu-item:first, .ui-menubar-item:first", event);
    },

    previous: function(event) {
        this.move("prev", ".ui-menu-item:last, .ui-menubar-item:last", event);
    },

    first: function() {
        return this.active && !this.active.prev().length;
    },

    last: function() {
        return this.active && !this.active.next().length;
    },

    move: function(direction, edge, event) {
        if (!this.active) {
            this.activate(event, this.element.children(edge));
            return;
        }
        var next = this.active[direction + "All"](".ui-menu-item, .ui-menubar-item ").eq(0);
        
        if (next.length) {
            this.activate(event, next);
        } else {
            this.activate(event, this.element.children(edge));
        }
        
    },

    // TODO merge with previousPage
    nextPage: function(event) {
        if (this.hasScroll()) {
            // TODO merge with no-scroll-else
            if (!this.active || this.last()) {
                this.activate(event, this.element.children(":first"));
                return;
            }
            var base = this.active.offset().top,
                height = this.element.height(),
                result = this.element.children("li").filter(function() {
                    var close = $(this).offset().top - base - height + $(this).height();
                    // TODO improve approximation
                    return close < 10 && close > -10;
                });

            // TODO try to catch this earlier when scrollTop indicates the last page anyway
            if (!result.length) {
                result = this.element.children(":last");
            }
            this.activate(event, result);
        } else {
            this.activate(event, this.element.children(!this.active || this.last() ? ":first" : ":last"));
        }
    },

    // TODO merge with nextPage
    previousPage: function(event) {
        if (this.hasScroll()) {
            // TODO merge with no-scroll-else
            if (!this.active || this.first()) {
                this.activate(event, this.element.children(":last"));
                return;
            }

            var base = this.active.offset().top,
                height = this.element.height();
                result = this.element.children("li").filter(function() {
                    var close = $(this).offset().top - base + height - $(this).height();
                    // TODO improve approximation
                    return close < 10 && close > -10;
                });

            // TODO try to catch this earlier when scrollTop indicates the last page anyway
            if (!result.length) {
                result = this.element.children(":first");
            }
            this.activate(event, result);
        } else {
            this.activate(event, this.element.children(!this.active || this.first() ? ":last" : ":first"));
        }
    },

    hasScroll: function() {
        return this.element.height() < this.element.attr("scrollHeight");
    },

    select: function( event ) {
        this._trigger("select", event, { item: this.active });
        var rootItem = $(event.target).closest(".ui-menubar-item");
        rootItem.parent().menu("activate", event, rootItem);
        $(".ui-menu").menu("hide");
    }
});

}(jQuery));
