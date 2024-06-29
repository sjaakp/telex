/* telex js-file. Build with rollup -c */
/*jshint esversion: 6,  strict: false*/

/**
 *  options: see defaults.
 *
 *  msgs: array of messages.
 *  A message is a plain object having the properties:
 *  - content   The content of the message. Can be text, but also a piece of HTML (like a link).
 *  - id        (Optional). Id of the message, starting with a word character.
 *                  It is only used in the `remove` method. It is not used as a DOM-id.
 *  - class     (Optional). The CSS-class of the message. May be used for styling purposes.
 */
import debounce from 'lodash.debounce';

function Widget(id, options, msgs) {
    Object.setPrototypeOf(this, {

        defaults: {
            /**
             * Speed in pixels per second, Integer or Float
             */
            speed: 200,

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
             * function(tlx), callback after each refresh cycle. Opportunity to reload Telex with new messages.
             * tlx points to the Telex instance.
             */
            onCycle: function(tlx)  {
            }
        },

        animStart: function(msg) {
            if (msg)    {
                let msgWidth = this._elementWidth(msg),
                    duration = 1000 * msgWidth / this.speed;

                if (msg.classList.contains('telex-head'))  this.onCycle(this);

                Object.assign(msg.style, {
                    marginLeft: `-${msgWidth}px`,
                    animationName: 'telex',
                    animationDirection: this.direction,
                    animationDuration: `${duration}ms`,
                    animationTimingFunction: this.timing,
                });
            }
        },

        animStop: function(msg) {
            if (msg)    {
                Object.assign(msg.style, {
                    marginLeft: null,
                    animationName: 'none',
                });
            }
        },

        discardMsg: function(msg)   {
            if (msg) {
                msg.classList.add('telex-discard');
            }
        },

        populate: function()    {
            let prevMsgCnt = this.element.children.length;

            this.element.childNodes.forEach(v => { this.discardMsg(v); });

            let telexWidth = this._elementWidth(this.element),
                accu = { total: 0, max: 0 };

            do {    // keep creating divs from msg's...
                accu = this._messages.reduce((ac, cur, idx) => {
                    if (typeof cur === 'string') { cur = { content: cur }; }
                    let div = document.createElement('div');
                    div.innerHTML = cur.content;
                    if (cur.class) { div.classList.add(cur.class); }
                    if (idx === 0) { div.classList.add('telex-head'); }
                    this.element.append(div);
                    let w = this._elementWidth(div);
                    return {
                        total: ac.total + w,
                        max: w > ac.max ? w : ac.max
                    };
                }, accu);

            } while (accu.total > 0 && accu.total < (telexWidth + accu.max));    // ... until total width is big enough

            if (! prevMsgCnt) {
                this.animStart(this.element.firstElementChild);
            }  // If this is the first child, start animation
        },

        _setAnimationState: function(state) {
            let firstChild = this.element.firstElementChild;
            if (firstChild) { firstChild.style.animationPlayState = state; }
        },

        _elementWidth(el)   {
            return el.getBoundingClientRect().width;    // returns fractional value (el.offsetWidth gives integer value)
        },

        _isVisible(msg) {
            return msg.getBoundingClientRect().right > this.element.getBoundingClientRect().left;
        },

        _removeIfDiscarded: function(msg)   {
            console.log(msg.getBoundingClientRect());
            if (msg && msg.classList.contains('telex-discard'))   {
                msg.remove();
                return true;
            }
            return false;
        },

        set messages(msg)   {
            this._messages = msg;
            this.populate();
        },

        get messages()  {
            return this._messages;
        },

        add: function(message) {
            this._messages.unshift(message);
            this.populate();
        },

        remove: function(id) {
            let i = this._messages.findIndex(e => e.id === id);
            if (i >= 0) { this._messages.splice(i, 1); }
            this.populate();
        },

        update: function(id, msg) {
            let i = this._messages.findIndex(e => e.id === id);
            if (i >= 0) {
                this._messages.splice(i, 1, msg);
            }
            this.populate();
        },

        pause: function()   {
            this._setAnimationState('paused');
        },

        resume: function()   {
            this._setAnimationState('running');
        },
    });

    this.element = document.getElementById(id);

    this.element.classList.add('telex');

    this.element.addEventListener('animationend', e => {    // bubbles up from firstchild
        this.animStop(e.target);

        if (this.direction === e.target.style.animationDirection) {     // skip if direction changed
            if (this.direction === 'normal')    {   // rotate child nodes right
                while (this._removeIfDiscarded(this.element.firstElementChild)) { /* do nothing */}
                let c = this.element.firstElementChild
                if (c) this.element.append(c);
            }
            else {      // direction 'reverse', rotate child nodes left
                while (this._removeIfDiscarded(this.element.lastElementChild)) { /* do nothing */}
                let c = this.element.lastElementChild
                if (c) this.element.prepend(c);
            }
        }
        this.animStart(this.element.firstElementChild);
    });

    this.element.addEventListener('mouseenter', e => {
        if (this.pauseOnHover) {
            this._setAnimationState('paused');
        }
    });

    this.element.addEventListener('mouseleave', e => {
        if (this.pauseOnHover && ! this._paused) {
            this._setAnimationState('running');
        }
    });

    window.addEventListener('resize', debounce(e => {
        this.populate();
    }, 300));

    Object.assign(this, this.defaults, options);

    this._messages = msgs;
    this.populate();
}

function widget(id, options, msgs) {
    return new this.Widget(id, options, msgs);
}

import './index.scss';
export {Widget, widget};

// const Telex = { Widget, widget };