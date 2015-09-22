/*global Math, jQuery, window, console */
/*jslint nomen: true, unparam: true, white: true, plusplus: true, todo: true */

(function($, undefined) {
    "use strict";

    $.fn.telex = function(options, arg) {

        return this.each(function() {

            var $this = $(this),
                settings,
                containerWidth,
                $head,
                inner,
                msgs,
                leading,

            // private methods
                _pause = function()  {
                    $this.find('.telex-leading').css('animation-play-state', 'paused');
                },
                _resume = function()  {
                    $this.find('.telex-leading').css('animation-play-state', 'running');
                },
                _prepareMsg = function(msg) {       // msg: jQuery element
                    var w = msg.outerWidth();

                    if (! $head.find('#tx' + w).length)  {    // skip if already exists
                        $head.append($('<style>', {     // append style block with keyframes to head
                            id: 'tx' + w
                        }).text('@keyframes tx-left' + w + ' {from {margin-left:0;} to {margin-left:-' + w + 'px;}} @keyframes tx-right' + w + ' {from {margin-right:0;} to {margin-right:-' + w + 'px;}}'));
                    }           // margin is animated from 0 to minus outer width
                },
                _makeClones = function(fromMsg, nMsgs)   {
                    var i, j, w, msg = fromMsg, wMax = 0, wTotal = 0, nTimes;

                    for (j = 0; j < nMsgs; j++) {
                        w = msg.outerWidth();
                        if (w > wMax) { wMax = w; }
                        wTotal += w;
                    }

                    nTimes = Math.floor((containerWidth + wMax) / wTotal) - 1;

                    for (i = 0; i < nTimes; i++)    {
                        msg = fromMsg;
                        for (j = 0; j < nMsgs; j++) {
                            inner.append(msg.clone());
                            msg = msg.next();
                        }
                    }
                },
                _setLeading = function(msg) {       // msg: jQuery element
                    var w = msg.outerWidth(),
                        keyframes = 'tx-' + settings.direction + w;

                    leading = msg;
                    msg.addClass('telex-leading').css({
                        animationName: keyframes,
                        animationDuration: (w * settings.duration / containerWidth) + 'ms'
                    });
                },
                _unsetLeading = function()  {       // return: previous leading
                    var r = leading;

                    leading = null;
                    r.removeClass('telex-leading').css({
                        animationName:  'none',
                        animationDuration: '0s',
                        animationDelay: '0s',
                        marginLeft: '0',
                        marginRight: '0'
                    });
                    return r;
                },
                _setLeadingDelayed = function(msg)  {
                    var w = msg.outerWidth(),
                        mgnProp = 'margin-' + settings.direction;

                    msg.css(mgnProp, containerWidth);
                    $head.append('<style>@keyframes txstart {from {' + mgnProp + ':' + containerWidth + 'px;} to {' + mgnProp + ':-' + w + 'px;}}</style>');
                    msg.css({
                        animationName: 'txstart',
                        animationDuration: ((containerWidth + w) * settings.duration / containerWidth) + 'ms',
                        animationDelay: settings.delay + 'ms'
                    });
                },


            // public functions
                methods = {
                    add: function (msgContent) {
                        return 0;
                    },
                    remove: function(msgId) {
                        return true;
                    },
                    pause: function()   {
                        _pause();
                    },
                    resume: function()  {
                        _resume();
                    }
                };

            if (typeof options === 'string') {
                if ($.isFunction(methods[options])) {
                    return methods[options](arg);
                }
                return;
            }

            settings = $.extend({}, $this.telex.defaults, {
                direction: $this.css('direction') === 'rtl' ? 'right' : 'left'
            }, options);

            containerWidth = $this.width();
            $head = $('head');

            $this.addClass('telex').wrapInner($('<div>', {
                class: 'telex-inner telex-' + settings.direction + (settings.ease ? ' telex-ease' : '')
            }));

            inner = $this.children();
            msgs = inner.children().addClass('telex-msg');

            msgs.each(function(i, e) {
                _prepareMsg($(e));
            });

            leading = msgs.first();

            _makeClones(leading, msgs.length);

            $this.on('animationend', function(e) {
                inner.append(_unsetLeading());
                _setLeading(inner.children(':first-child'));
            }).on('mouseenter', function(e) {
                if (settings.pauseOnHover) { _pause(); }
            }).on('mouseleave', function(e) {
                if (settings.pauseOnHover) { _resume(); }
            });

            if (settings.delay) {
                _setLeadingDelayed(leading);
            }
            else    {
                _setLeading(leading);
            }
        });
    };


//    $.fn.marquee.idCounter = 0;

    $.fn.telex.defaults = {
        // delay time before animation starts in milliseconds
        delay: 1000,

        //true or false - should the marquee be duplicated to show an effect of continues flow
        duration: 5000,

        // 'left' or  'right' - direction of movement; default for ltr-text: 'left', default for rtl-text: 'right'
        direction: 'left',

        // true: anmimation-timing-function is 'ease'; false: linear animation
        ease: false,

        // pause ticker on hover
        pauseOnHover: false
    };
}(jQuery));

