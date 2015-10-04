/*global Math, jQuery, window, console */
/*jslint nomen: true, unparam: true, white: true, plusplus: true, todo: true */
/**
 * MIT licence
 * Version 1.0.0
 * Sjaak Priester, Amsterdam 04-10-2015.
 * @link http://www.sjaakpriester.nl/
 */

(function ($, undefined) {
    'use strict';

    $.widget('sjaakp.telex', {

        options:    {

            /**
             * Delay time before scrolling starts in milliseconds
             */
            delay: 1000,

            /**
             * integer, time it takes for a message to scroll along main window in milliseconds
             */
            duration: 5000,

            /**
             *  'normal' (to left) or  'reverse' (to right) - direction of movement
             */
            direction: 'normal',

            /** string, timing-function used for the animation; 'ease-in-out' may be another useful value
             * @see https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function
             */
            timing: 'linear',

            /**
             * boolean, pause ticker on hover
             */
            pauseOnHover: false,

            /**
             *  array of messages.
             *  A message is a plain object having the properties:
             *  - content   The content of the message. Can be text, but also a piece of HTML (like a link).
             *  - id        (Optional). Id of the message, starting with a word character. It is only used in the `remove` method.
             *  - class     (Optional). The CSS-class of the message. May be used for styling purposes.
             */
            messages: []
        },

        _blocks: [],

        _leading: null,

        _create: function() {
            $('<style>').text('.telex{overflow: hidden;white-space: nowrap;}.telex-inner{height: 1.5em;width: 60000px;}.telex-msg{display: inline-block;height: 100%;}.telex{background-color: #eceff1;}.telex-msg{padding-left: 1.5em;padding-right: 1.5em;}').insertBefore($('[rel=stylesheet]').first());

            this._inner = $('<div>', {
                class: 'telex-inner'
            });

            this.element.addClass('telex').append(this._inner);

            this._prepareBlocks();

            this.element.on('animationend', function(e) {
                this._nextBlock();
            }.bind(this)).on('mouseenter', function(e) {
                if (this.options.pauseOnHover) { this.pause(); }
            }.bind(this)).on('mouseleave', function(e) {
                if (this.options.pauseOnHover) { this.resume(); }
            }.bind(this));

            this._start(true);
        },

        _start: function(delay) {
            var first = this._inner.children(':first-child'),
                from = 0,
                wTelex = this.element.width();

            if (first.length)   {
                if (this.options.delay) { first.css('margin-left', wTelex); }

                if (this.options.direction === 'normal')    {
                    from = wTelex;
                    this._generateKeyframes(from, first.outerWidth());
                }
                else    {
                    first = this._inner.children(':last-child');
                    first.css('margin-left', - first.outerWidth());
                    this._inner.prepend(first);
                }

                this._setLeading(first, from, true);
            }
        },

        /**
         * @param from      begin value of normal animation (generally 0)
         * @param to        absolute value of end value (generally outer width of message)
         * @private
         */
        _generateKeyframes: function(from, to) {
            var $head = $('head'), id = 'f' + from + 't' + to;

            if (! $head.find('#' + id).length)  {    // skip if already exists
                $head.append($('<style>', {     // append style block with keyframes to head
                    id: id
                }).text('@keyframes ' + id + ' {from {margin-left:' + from + 'px;} to {margin-left:-' + to + 'px;}}'));
            }           // note minus sign before to!
        },

        /**
         * @param e         msg element
         * @param from      begin value of animation
         * @param delay     boolean whether delay should be applied
         * @returns e
         * @private
         */
        _setLeading: function(e, from, delay) {
            var w = e.outerWidth();

            this._leading = e;
            e.css({
                animationName: 'f' + from + 't' + w,
                animationDirection: this.options.direction,
                animationDuration: ((w + from) * this.options.duration / this.element.width()) + 'ms',
                animationTimingFunction: this.options.timing,
                animationDelay: (delay ? this.options.delay : 0) + 'ms'
            });
            return e;
        },

        _unsetLeading: function() { // return: previous leading element
            var r = this._leading;

            if (r)  {
                this._leading = null;
                r.css({
                    animationName:  'none',
                    marginLeft: 0
                });
            }
            return r;
        },

        _nextBlock: function()  {
            var dir = this.options.direction, b, w, par, last = false;

            if (this._leading.css('animation-direction') !== dir) {  // direction flipped
                w = this._leading.outerWidth();
                par = {
                    animationName: 'f0t' + w,
                    animationDirection: dir,
                    animationDuration: (w * this.options.duration / this.element.width()) + 'ms',
                    animationDelay: '0s'
                };
                this._leading.css({
                    animationName:  'none'
                });

                // pause for a small time and flip direction
                // (Edge seems to need 100 ms, Chrome and Firefox manage with 1 ms)
                window.setTimeout(function(leading, par) {
                    leading.css(par);
                }, 200, this._leading, par);
            }
            else    {       // normal operation, direction unchanged
                if (dir === 'normal')   {
                    b = this._unsetLeading();
                    if (b) {
                        if (b.hasClass('telex-discard'))    { b.remove(); }
                        else { this._inner.append(b); }
                    }
                    this._setLeading(this._inner.children(':first-child'), 0, false);
                }
                else    {
                    this._unsetLeading();
                    b = this._inner.children(':last-child');
                    while (b.length && b.hasClass('telex-discard') && ! b.hasClass('telex-last')) {
                        b.remove();
                        b = this._inner.children(':last-child');
                    }
                    last = b.hasClass('telex-last');
                    b.removeClass('telex-last');
                    this._setLeading(b.prependTo(this._inner), last ? this.element.width() : 0, false);
                }
            }
        },

        _prepareBlocks: function()  {
            var wMax = 0, wTotal = 0, nCycles, i,
                appendClone = function(v, i, a) { this._inner.append(v.clone()); };

            if (this.options.messages.length)   {
                this._blocks = this.options.messages.map(function(v, i, a) {
                    var w, b = $('<div>', {
                        class: 'telex-msg ' + (v.class || '')
                    }).html(v.content || '');

                    this._inner.append(b);
                    w = b.outerWidth();     // determine after b is placed in DOM
                    this._generateKeyframes(0, w);
                    wTotal += w;
                    if (w > wMax)   { wMax = w; }

                    return b;
                }, this);

                if (wTotal) {
                    nCycles = Math.floor((this.element.width() + wMax) / wTotal);

                    for (i = 0; i < nCycles; i++)    {
                        this._blocks.forEach(appendClone, this);
                    }
                }
            }
            else    {
                this._inner.children(':last-child').addClass('telex-last');
            }

        },

        _discardBlocks: function()  {
            this._inner.children().addClass('telex-discard');
        },

        _setOption: function(key, value)    {
            var n = this._inner.children().length;

            this._super(key, value);
            if (key === 'messages') {
                this._discardBlocks();
                this._prepareBlocks();
                if (! n) { this._start(false); }
            }
        },

        _setOptions: function(options)  {
            this._super(options);
        },

        add: function(message) {
            var n = this._inner.children().length;
            this._discardBlocks();
            this.options.messages.unshift(message);
            this._prepareBlocks();
            if (! n) {
                this._start(false);
            }
        },

        remove: function(id) {
            this._discardBlocks();
            this.options.messages = this.options.messages.filter(function(v, i, a) {
                return v.id !== id;
            }, this);
            this._prepareBlocks();
        },

        pause: function()   {
            this._leading.css('animation-play-state', 'paused');
        },

        resume: function()   {
            this._leading.css('animation-play-state', 'running');
        }
    });

} (jQuery));