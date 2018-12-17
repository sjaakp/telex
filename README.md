Telex 2.0
=========

#### News scroller ####

**Telex** is a horizontal news scroller for text messages. It can be used for continuously displaying breaking news, traffic information, stock quotes, and the like. Messages can be added or removed while scrolling, speed and other options can be updated.

**Telex** is a Javascript (ES2015) widget. It works with modern browsers supporting the CSS property `animation`. This includes:

- IE >= 10
- Edge
- Firefox >= 38
- Chrome >= 43
- Safari >= 9
- Opera >= 32
- Android Browser >= 44

A demo of **Telex** is [here](http://www.sjaakpriester.nl/software/telex).

Here is **Telex**'s  [GitHub page](https://github.com/sjaakp/telex).

**Telex** is distributed under the [MIT License](http://mit-license.org/).

## Installing ##

Install **Telex** with [Bower](http://bower.io/):

	bower install telex

You can also manually install **Telex** by [downloading the source in ZIP-format](https://github.com/sjaakp/telex/archive/master.zip).

## Dependencies ##

From version 2.0, **Telex** has no external dependencies whatsoever.

## Usage ##

- Load `/dist/telex.js`.
- Create a `<div>` with an `id`. 
- In the document-ready function, set a Javascript variable with the result of a call to the function `Telex.widget` with parameters `id`, options and (optionally) the first messages. Options are in a Javascript Plain Old Object, messages are in a Javascript Array.

A minimum HTML page with a **Telex** would look like this:

	<html>
	<body>

		<div id="tx"></div>

		<script src="/dist/telex.js"></script>

		<script>
			$(document).ready(function () {
				var qtx = Telex.widget("tx", {/* options */}, [/* messages */]);
		</script>
	</body>
	</html>

The **Telex**-container gets the CSS-class `telex`. This may also be used for styling purposes.

## Messages ##

Messages can be set at create time, but also by assigning a value to **Telex**'s property `messages`, like so:

	qtx.messages: [
			{
            	id: 'msg1',
            	content: 'This is the first message'
			},
			{
            	id: 'msg2',
            	content: 'This is the second message',
				class: 'cls-second'
			}
			/* more messages... */
		]
		/* more options... */
		});

`messages` is an `Array` of `Objects`, each representing a message, with the following properties:

#### content ####

The content of the message. Can be text, but also a piece of HTML (like a link).

#### id ####

*Optional*. Id of the message, starting with a word character. It is only used in the `remove` method. It is not employed as a DOM-id.

#### class ####

*Optional*. The CSS-class of the message. May be used for styling purposes.

A message may also be represented by a `String` in stead of an `Object`. 

## Other options ##

**Telex** has the following general options:

#### speed ####

`integer` or `float`. Scrolling speed in pixels per second. Default: `200`.

#### direction ####

`string`. Scroll direction. Can be `normal` (from right to left) or `reverse` (from left to right). Default: `normal`.

#### timing ####

`string`. Determines the way a single message scrolls. Can be any value valid for the [`animation-timing-function`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function "MDN Network"). Default: `linear`. Another sensible value would be `ease-in-out`.

#### pauseOnHover ####

`boolean`. Determines whether the scrolling pauses when the mouse cursor hovers above it. Default: `false`.

#### onCycle ####

`function(tlx)`. Callback function, called after each completed cycle of newly loaded messages. This may be used as an opportunity to load new (realtime) messages.

## Setting and getting options ##

Options can (and should) be set at create time, and later simply by assigning a value to the **Telex** property with the option name:

	qtx.speed = <newValue>;  

Options can be read with:

	<value> = qtx.direction;

## Methods ##

**Telex** has four methods. They can be called like:

	qtx.add({
		id: "newMsg",
		content: "This message will be added while Telex is running"
	});  

#### add(message) ####

Adds a message to **Telex** while it is scrolling. Note that it takes some time for the message to appear.

#### remove(id) ####

Removes the message with the given `id`.

#### update(id, message) ####

Updates the message with the given `id`.

#### pause() ####

Pauses the scroller.

#### resume() ####

Resumes scrolling.

## Building telex.js ##

Be sure that `npm` [is installed](https://www.npmjs.com/get-npm).

Run `npm install`.

Run `rollup -c`.