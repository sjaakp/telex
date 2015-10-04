Telex
=====

#### jQuery news scroller ####

**Telex** is a jQuery UI horizontal news scroller for text messages. Messages can be added or removed while scrolling.

**Telex** works with modern browsers supporting the CSS property `animation`. This includes:

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

You can also manually install **Dateline** by [downloading the source in ZIP-format](https://github.com/sjaakp/telex/archive/master.zip).

## Dependencies ##

**Telex** depends on:

- jQuery 1.8
- jQuery UI 1.1

## Usage ##

- Load the Javascript libraries `jquery.js` and `jquery-ui.js` (you probably need some of them on your page anyway).
- Load `/dist/telex.js`.
- Create a `<div>` with an `id`. 
- In the document-ready function, encapsulate the `<div>` in a jQuery object, and call the `telex()` method.

A minimum HTML page with a **Telex** would look like this:

	<html>
	<body>

		<div id="tx"></div>

		<script src=".../jquery.js"></script>
		<script src=".../jquery-ui.js"></script>
		<script src="/dist/telex.js"></script>

		<script>
			$(document).ready(function () {
				$('#tx').telex(/* options */);
		</script>
	</body>
	</html>

## Messages ##

At this point, Dateline displays nothing, because there are no messages defined. This is done by setting the option `messages`, like so:

	$('#tx').telex({
		messages: [
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

`messages` is an array of objects, each representing a message, with the following properties:

#### content ####

The content of the message. Can be text, but also a piece of HTML (like a link).

#### id ####

*Optional*. Id of the message, starting with a word character. It is only used in the `remove` method.

#### class ####

*Optional*. The CSS-class of the message. May be used for styling purposes.

## Other options ##

**Telex** has the following general options:

#### delay ####

`integer`. Delay before scrolling starts in milliseconds. Default: `1000`.

#### duration ####

`integer`. Time it takes for a message to scroll along **Telex** main window in milliseconds. Default: `5000`.

#### direction ####

`string`. Scroll direction. Can be `normal` (from right to left) or `reverse` (from left to right). Default: `normal`.

#### timing ####

`string`. Determines the way a single message scrolls. Can be any value valid for the [`animation-timing-function`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function "MDN Network"). Default: `linear`. Another sensible value would be `ease-in-out`.

#### pauseOnHover ####

`boolean`. Determines whether the scrolling pauses when the mouse cursor hovers above it. Default: `false`.


## Setting and getting options ##

**Telex** is a [jQuery UI widget](http://wiki.jqueryui.com/w/page/12137708/How%20to%20use%20jQuery%20UI%20widgets "jQuery wiki"). The options can (and should) be set at create time, or later at run time by using:

	$("#tx").telex("option", "<optionName>", <newValue>);  

Options can be read with:

	var value = $("#tx").telex("option", "<optionName>");

## Methods ##

**Telex** has four methods. They should be called in the jQuery UI-fashion, i.e:

	$("#tx").dateline("add", {
		id: "newMsg",
		content: "This message is added while Telex is running"
	});  

#### add(message) ####

Adds a message to **Telex** while it is scrolling. Note that it takes some time for the message to appear.

#### remove(id) ####

Removes the message with the given `id`.

#### pause() ####

Pauses the scroller.

#### resume() ####

Resumes scrolling.
