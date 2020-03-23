/*
Modified by J-888 on 2017
José Miguel Tajuelo Garrigós
<J-888.github.io>
*/

/*
Copyright (c) 2011 Sam Phippen <samphippen@googlemail.com>
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var Typer = {
	text: null,
	accessCountimer: null,
	index: 0, // current cursor position
	speed: 2, // speed of the Typer
	file: "", //file, must be setted
	accessCount: 0, //times alt is pressed for Access Granted
	deniedCount: 0, //times caps is pressed for Access Denied
	init: function() { // inizialize Hacker Typer
		accessCountimer = setInterval(function() {
			Typer.updLstChr();
		}, 500); // inizialize timer for blinking cursor
		$.get(Typer.file, function(data) { // get the text file
			Typer.text = data; // save the textfile in Typer.text
			Typer.text = Typer.text.slice(0, Typer.text.length - 1);
		});
	},

	content: function() {
		return $("#console").html(); // get console content
	},

	write: function(str) { // append to console content
		$("#console").append(str);
		return false;
	},

	makeAccess: function() { //create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
		Typer.hidepop(); // hide all popups
		Typer.accessCount = 0; //reset count
		var ddiv = $("<div id='gran'>").html(""); // create new blank div and id "gran"
		ddiv.addClass("accessGranted"); // add class to the div
		ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
		$(document.body).prepend(ddiv); // prepend div to body
		return false;
	},
	makeDenied: function() { //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
		Typer.hidepop(); // hide all popups
		Typer.deniedCount = 0; //reset count
		var ddiv = $("<div id='deni'>").html(""); // create new blank div and id "deni"
		ddiv.addClass("accessDenied"); // add class to the div
		ddiv.html("<h1>ACCESS DENIED</h1>"); // set content of div
		$(document.body).prepend(ddiv); // prepend div to body
		return false;
	},

	hidepop: function() { // remove all existing popups
		$("#deni").remove();
		$("#gran").remove();
	},

	addText: function(key) { //Main function to add the code
		if (key.keyCode == 18) { // key 18 = alt key
			Typer.accessCount++; //increase counter 
			if (Typer.accessCount >= 3) { // if it's presed 3 times
				Typer.makeAccess(); // make access popup
			}
		} else if (key.keyCode == 20) { // key 20 = caps lock
			Typer.deniedCount++; // increase counter
			if (Typer.deniedCount >= 3) { // if it's pressed 3 times
				Typer.makeDenied(); // make denied popup
			}
		} else if (key.keyCode == 27) { // key 27 = esc key
			Typer.hidepop(); // hide all popups
		} else if (Typer.text) { // otherway if text is loaded
			var cont = Typer.content(); // get the console content
			if (cont.substring(cont.length - 1, cont.length) == "|") // if the last char is the blinking cursor
				$("#console").html($("#console").html().substring(0, cont.length - 1)); // remove it before adding the text
			if (key.keyCode != 8) { // if key is not backspace
				Typer.index += Typer.speed; // add to the index the speed
			} else {
				if (Typer.index > 0) // else if index is not less than 0 
					Typer.index -= Typer.speed; //	remove speed for deleting text
			}
			var text = Typer.text.substring(0, Typer.index) // parse the text for stripping html enities
			var rtn = new RegExp("\n", "g"); // newline regex

			$("#console").html(text.replace(rtn, "<br/>")); // replace newline chars with br, tabs with 4 space and blanks with an html blank
			window.scrollBy(0, 50); // scroll to make sure bottom is always visible
		}
		if (key.preventDefault && key.keyCode != 122) { // prevent F11(fullscreen) from being blocked
			key.preventDefault()
		};
		if (key.keyCode != 122) { // otherway prevent keys default behavior
			key.returnValue = false;
		}
	},

	updLstChr: function() { // blinking cursor
		/*if(this.file != "consoleContent/showcase.html" && this.file != "consoleContent/showcase" && this.file != "consoleContent/DVI.html" && this.file != "consoleContent/DVI") {
			var cont = this.content(); // get console 
			if (cont.substring(cont.length - 1, cont.length) == "|") // if last char is the cursor
				$("#console").html($("#console").html().substring(0, cont.length - 1)); // remove it
			else
				this.write("|"); // else write it
		}*/
	}
}

function replaceUrls(text) {
	var http = text.indexOf("http://");
	var space = text.indexOf(".me ", http);
	if (space != -1) {
		var url = text.slice(http, space - 1);
		return text.replace(url, "<a href=\"" + url + "\">" + url + "</a>");
	} else {
		return text
	}
}
Typer.speed = 5;
var currenthref = $(location).attr('href');
var modifiedhref = currenthref.substring( currenthref.lastIndexOf("/")+1, currenthref.length);
//Typer.file = "consoleContent/" + currenthref.replace(/\.html$/, ".txt";
Typer.file = "/consoleContent/" + modifiedhref;
Typer.init();

var timer = setInterval("t();", 30);

function t() {
	Typer.addText({
		"keyCode": 123748
	});
	if (Typer.text !== null && Typer.index > Typer.text.length) {
		clearInterval(timer);
	}
}
