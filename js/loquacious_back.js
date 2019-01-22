/* ----------------------------------------------------------------------------
   Loquacious v2.0 Copyright 2015 SPEL Technologies, Inc. All Rights Reserved.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ----------------------------------------------------------------------- */


var CodeMirror = CodeMirror || {};
var Loquacious = Loquacious || {};

/**
 * This function modifies the input to replace punctuation marks with the spoken word
 * @method punct
 * @param {string} input the input string
 * @param {Array} chars is the array containing the word for each punctuation mark
 * @return {string} the modified input
 */                
function punct(input, chars) {
	var output = "";
	var addedBoolCheck = false;
	if (chars === undefined) {
		var chars = [[" ampersand ", "&"], [" backslash ", "\\"], [" caret ", "^"], [" colon ",":"], [" comma ",","], [" dollar ", "$"], [" dot ","."], [" equals ","="], [" greater than ", ">"], [" less than ", "<"], [" exclamation ", "!"], [" hash ", "#"], [" left bracket ","["], [" left brace ","{"], [" left parenthesis ","("],  [" minus ","-"],  [" modulo ","%"], [" new line ", "\n" ], [" right parenthesis ",")"], [" slash ","/"],  [" plus ","+"], [" question mark ","?"], [" quotes ",'"'], [" quote ","'"], [" right brace ","}"], [" right bracket ","]"], [" semicolon ",";"], [" tilde ", "~"], [" tab ", "	"], [" times ", "*"], [" underscore ", "_"]];
	}

	if (input === null) {
		input = "";
	}

	var i = 0;

	while (i <= input.length-1) {
		// check for space
		if (input[i] === " ") {
			var num_spaces = 0;

			// count number of spaces
			while (input[i] === " ") {
				num_spaces += 1;
				i++;
			}

			i--;
			if (num_spaces > 1)
				output += ", " +num_spaces + "spaces" +", ";
			else
				output += " " + ",";
		}
		// check if the input matches any characters in the array chars
		else { 
			var match_found = false;
			var k = 0;
			while ((k <= chars.length-1) && (match_found === false)) {
				if (input[i] === chars[k][1]) {
					match_found = true;
					output += ", "+ chars[k][0] + ", ";
				}
				k++;
			}

			// not a space or a punctuation mark
			if (match_found === false) {
				// if uppercase alphabetic character, prefix the word "capital" before it
				if (input[i] === input[i].toUpperCase() && input[i] !==input[i].replace(/\D/g,''))
					output += ", " + "capital "  +", ";
				output += input[i];
			}
		}
		i++;  
	}
	return output;
};

var speaking = false;

/**
 * This function speaks out the argument string
 * @method sayit
 * @param {string} currentString the input string
 */              
function sayit(currentString){

	if (currentString == "") {
		var no = document.getElementById("editorNumber").value;
		currentString = document.getElementById("loquacious"+no).value;
	}
	preload();

	if (!speaking) {
		speaking=true;
		//if (getAudioFlag() == true) {
		speakNow(punct(currentString));
		//}
	}
	speaking = false;
};


//load Loquacious editor (with CodeMirror or text area option)
//assumes that there is only one active editor per window
function loadLoquaciousEditor(id) {

	createLoquaciousAriaRegion();  // support for accessibility in Loquacious

	var userCode;

	// If user has specified flag to use only textarea editor, don't use CodeMirror, otherwise, use CodeMirror in Loquacious
	if (Loquacious.isTextarea) {  

		// if CodeMirror is already uploaded and visible, hide it; 
		if (CodeMirror.isLoaded && !Loquacious.isCodeMirrorHidden) {
			/*[].forEach.call(document.querySelectorAll('.CodeMirror'), function (el) {
			  el.style.visibility = 'hidden';
			});*/

			userCode = CodeMirror.editor.getDoc().getValue();
			// load the code from CodeMirror into the textarea
			document.getElementById(id).value = userCode;
			$('.CodeMirror').hide();  // hide CodeMirror
			Loquacious.isCodeMirrorHidden = true;
		}

		if (document.getElementById(id).style.display === "none") {  // display textarea
			document.getElementById(id).style.display = "block";
		} 

		// attach event handler  to handle keyup events in textarea if CodeMirror is not uploaded and 
		// user has selected text-to-speech on Loquacious panel
		if (!Loquacious.isEventListenerAttachedToTextarea && Loquacious.isMeSpeak) {
			//console.log("add event handler to text area "+id);
			addEventListenerToTextarea(id);
			Loquacious.isEventListenerAttachedToTextarea = true;
			preload();  // for meSpeak
		}
	}
	else {   // use CodeMirror as editor, load CodeMirror
		if (!CodeMirror.isLoaded) {
			var userCode12 = document.getElementById(id).value;
			// hide text area; 
			if (document.getElementById(id).style.display === "block") {
				document.getElementById(id).style.display = "none";
			} 
			loadCodeMirrorEditor(id);
			CodeMirror.isLoaded = true;
			Loquacious.isCodeMirrorHidden = false; // CodeMirror is not hidden
			// load code from textarea into CodeMirror
			CodeMirror.editor.setValue(userCode12);

		} else if (Loquacious.isCodeMirrorHidden) { // CodeMirror is loaded, but hidden

			userCode = document.getElementById(id).value;
			// hide text area; 
			if (document.getElementById(id).style.display === "block") {
				document.getElementById(id).style.display = "none";
			} 
			var cm = $('.CodeMirror')[0].CodeMirror;
			// Display CodeMirror
			$(cm.getWrapperElement()).show();
			Loquacious.isCodeMirrorHidden = false; // CodeMirror is not hidden
			// load code from textarea into CodeMirror
			CodeMirror.editor.setValue(userCode);
		}


		if (Loquacious.isMeSpeak)
			preload(); // enable meSpeak inside CodeMirror
	}


}

function loadCodeMirrorEditor(id) {

	CodeMirror.editor = CodeMirror.fromTextArea(document.getElementById(id), {
		mode: {
			name: "python",
			version: 2,
			singleLineStringErrors: false},
			lineNumbers: true,
			lineWrapping: true,
			styleActiveLine: true,
			styleActiveSelected: true,
			indentUnit: 3,
			matchBrackets: true,
			extraKeys: {
				"Tab": false,  // default behaviour for Tab key to avoid keyboard trap for accessibility 
			},
			lineWrapping: true 

	}); 

	CodeMirror.editor.setOption("readOnly", false); // make area editable
	// initial data in textarea with id loaded into the editor
	var code = document.getElementById(id).value;
	CodeMirror.editor.setValue(code);

	// used for events that change the CodeMirror DOM
	// announce changed data from key events not button click events
	CodeMirror.executeOnChangeEventHandler = true;  // initialize to true, and set variable to false to disable handling this even
	CodeMirror.editor.on("change", function(cm, obj)  {
		if (CodeMirror.executeOnChangeEventHandler) {
			var data = (obj.removed).toString();

			LoquaciousSpeak(data);

		}
	});

	// used for key events that don't change the CodeMirror DOM
	//The event "keyHandled" is registered using the "on" method of CodeMirror.
	CodeMirror.editor.on("keyHandled", function(cm, name, event) {
		//console.log("registered keyhandled event for editor");
		doc = CodeMirror.editor.getDoc();

		// get line number on which cursor is positioned
		var startCursor = CodeMirror.editor.getCursor();  
		var cursorLine = startCursor.line;
		var ch = startCursor.ch, data;
		var handled = false;  // Some onChange events also trigger keyHandled, don't announce the event again

		if ((name == "Up") || (name == "Down") || (name == "Ctrl-N") || (name == "Ctrl-P")) { // get data of line on which cursor is positioned
			data = doc.getLine(cursorLine); 
			handled = true;
		} else if ((name == "Ctrl-Home") || (name == "Cmd-Up") || (name == "Cmd-Home")) {   // get word at start of document
			var startLine = CodeMirror.editor.firstLine();

			// get individual words in first line and extract the first word
			var lineData = doc.getLine(startLine).split(" ");
			data = lineData[0];
			handled = true;
		} else if ((name == "Ctrl-End") || (name == "Cmd-End") || (name == "Cmd-Down")){  // get word at end of document
			var endLine = CodeMirror.editor.lastLine(); 

			// get individual words in first line and extract the last word
			var lineData = doc.getLine(endLine).split(" ");
			data = lineData[lineData.length - 1];
			handled = true;
		}  
		else if ((name == "Alt-Left") || (name == "Ctrl-A") || (name == "Home")){     // get word at start of line
			// get individual words in first line and extract the first word
			var lineData = doc.getLine(cursorLine).split(" ");
			data = lineData[0];
			handled = true;
		}
		else if ((name == "Left") || (name == "Ctrl-B")){			          // get character before cursor
			data = doc.getLine(cursorLine).charAt(ch-1); 
			handled = true;
		}
		else if ((name == "Right") || (name == "Ctrl-F")){				      // get character after cursor
			data = doc.getLine(cursorLine).charAt(ch); 
			handled = true;
		}
		else if (name == "Alt-B"){		   	// get the previous word
			var lineData = doc.getLine(cursorLine).slice(ch).split(" ");
			data = lineData[0];
			handled = true;
		}    
		else if (name == "Alt-F"){              // get the next word
			var lineData = doc.getLine(cursorLine).slice(ch).trim().split(" ");
			data = lineData[0];
			handled = true;
		}	

		if (handled) {
			LoquaciousSpeak(data); // speak using meSpeak or screen reader, depending on user settings
		}
	});
	//CodeMirror.editor.focus();
	//CodeMirror.editor.setCursor({line: 1, ch: 0})
} 

/* This function checks if mespeakCookie is set in the accessibility panel and will read out data based on these
 * settings, if it is. Otherwise, it checks if the Loquacious editor option to enable meSpeak is on and it will speak out data
 * using meSpeak with default settings. Otherwise, the screen reader will get the data (sent to Loquacious aria region).
 */
function LoquaciousSpeak(data) {
	// if meSpeak is set, then meSpeak with speak the data
	var mespeakcookie = getCookie("isMeSpeak");

	if (mespeakcookie === "true") {
		meSpeak.stop();
		var mespeakvariant = getCookie("mespeak_variant");
		var mespeakspeed = getCookie("mespeak_speed");
		mespeakspeed = mespeakspeed * 2;

		meSpeak.speak(punct(data), {"speed":mespeakspeed, "variant": mespeakvariant});
	}
	else if (Loquacious.isMeSpeak)	{
		// CodeMirror used but is not accessible to screenreader, use meSpeak here
		console.log("mespeak1234:"+data);

		meSpeak.speak(punct(data));
	} else {
		// screen reader will read out the line in element "accessibleEditor" with an aria-live attribute
		screenreader(punct(data)); 

	}
}

/**
 * This function runs a python program.It
 * gets the code from code area called "loquacious", and
 * gets the reference to the pre element for output. It then
 * calls Sk.importMainWithBody to run the program.
 * After the program is run, it reads out either the output if the program ran successfully or the errors.
 *
 * @method runitAndTest
 */             
function runitAndTest(flag) { 
	//console.log("inside runit() test");
	preload();
	meSpeak.stop();

	var no;
	if (document.getElementById("editorNumber"))  
		no=document.getElementById("editorNumber").value;
	else 
		no = "";
	//var prog = document.getElementById("loquacious"+no).value; 

	var prog;
	// read the program from CodeMirror or the textarea
	if (!Loquacious.isTextarea)
		prog = CodeMirror.editor.getDoc().getValue();
	else
		prog = document.getElementById("loquacious"+no).value; 

	// console.log(prog);

	var mypre = document.getElementById("output"); 
	document.getElementById("output"+no).textContent = ""; // clear output
	document.getElementById("status").textContent = ""; // clear output
	if (document.getElementById("hints"))
		document.getElementById("hints").textContent = "";


	if(prog==""){
		//document.getElementById("output"+no).focus();

		document.getElementById("output"+no).textContent = "Enter a program";
		document.getElementById("status").textContent = "";

		var mespeakcookie = getCookie("isMeSpeak");

		if (mespeakcookie == "true") {
			speakNow("Enter a program");
		}
		screenreader("Enter a program");


	}
	else{
		// preprocess prog          
		runprog();
	}    

	function runprog() {
		mypre.textContent = ''; 
		Sk.pre = "output";

		Sk.configure({output:outf, read:builtinRead}); 
		(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
		var compiled = false;      
		var myPromise = Sk.misceval.asyncToPromise(function() {
			return Sk.importMainWithBody("<stdin>", false, prog, true);
		}); 


		myPromise.then(function(mod) {
			compiled = true;

			// process the output of the program
			var mypre = document.getElementById("output"); 

			document.getElementById("output"+no).textContent = mypre.textContent;
			spokenWord=punct(mypre.textContent);


			var mespeakcookie = getCookie("isMeSpeak"); 

			if (mespeakcookie === "true") {
				var mespeakvariant = getCookie("mespeak_variant");
				var mespeakspeed = getCookie("mespeak_speed");
				mespeakspeed = mespeakspeed * 2;
			}

			if (mespeakcookie === "true") {
				meSpeak.stop();
				meSpeak.speak("The program output is, "+spokenWord, {"speed":mespeakspeed, "variant": mespeakvariant}, function() {

					if (flag == "book") {
						checkit_book(); // check user's solution in book
					} else if (flag === "tutorial"){
						// console.log("calling checkit()");
						checkit(); // check the user's solution
					}


				});
			}
			else {  

				if (flag === "book") {
					checkit_book();  // check user's solution in book					
				}
				else if (flag === "tutorial"){
					checkit(); // check the user's solution in tutorial		
					// read output with screenreader
					var str = document.getElementById("output"+no).textContent;
					var str1 = document.getElementById("status").textContent;
					var str2 = document.getElementById("hints").textContent;

					screenreader("The program output is" +"    "+str+",,,,,,,     "+str1+",,,,,,,     "+punct(str2));
				}

			}

		},
		function(err) {
			// record the first error in the program
			str = err.toString();

			// set the focus to the area that displays the output for screenreader
			//document.getElementById("output"+no).focus();

			// extract the number of the line that has error
			var substr = str.match(/line \d+/); 
			//console.log(substr);

			var lineNum = substr[0].replace(/\D/g, '');      
			//console.log("this line has error " +lineNum);
			document.getElementById("output"+no).textContent = str;
			document.getElementById("output"+no).textContent += "\n line "+lineNum+" has error ";

			if (!Loquacious.isTextarea) {           // position cursor on line with error in CodeMirror
				if (!CodeMirror.editor.hasFocus())
					CodeMirror.editor.focus();

				CodeMirror.editor.setCursor({line: lineNum-1, ch: 0});
			}
			else
				setCursorPosition(document.getElementById('loquacious'+no), lineNum); // position cursor on line with error in textarea


			var mespeakcookie = getCookie("isMeSpeak");

			// speak out first error in program
			if (mespeakcookie == "true") {
				speakNow(punct(str));
			}
			// read the output using screenreader
			setTimeout(  function() {screenreader(punct(str))} , 2000 );
			
			if (flag === "tutorial"){
				checkit(); // check the user's solution in tutorial		
				// read output with screenreader
				var str = document.getElementById("output"+no).textContent;
				var str1 = document.getElementById("status").textContent;
				var str2 = document.getElementById("hints").textContent;

				screenreader("The program output is" +"    "+str+",,,,,,,     "+str1+",,,,,,,     "+punct(str2));
			}
		});
	}; 
}


/**
 * Used for speaking aloud the contents of CodeMirror. This function speaks the complete program. As each line is read out, the cursor is positioned at the start of that line.
 * Pressing any key cancels the overview, and the programmer can start editing the program from the next line.
 *
 * @method speak
 */ 
function speak() {
    console.log("here12");

	preload();
    console.log("here123");
	if (!Loquacious.isTextarea) {  // read in CodeMirror
		if (!CodeMirror.editor.hasFocus())
			CodeMirror.editor.focus();

		var stopOverview = false; 
	    console.log("here1234");

		// stop meSpeak on a keydown event
		CodeMirror.editor.on('keydown', stopHighLevelOverview);

		function stopHighLevelOverview(editor, event) {       
			var keyCode = event.which;
			//console.log("stopped high level overview");
			// stop if any key except Ctrl is pressed as Ctrl is used to stop screen reader announcements
			if (keyCode != 17) 
				stopOverview = true;
		}

		// set cursor's start line number to the first line 
		var cursorLine = 0;

		var data = [];

		var totalLines = CodeMirror.editor.lineCount();

		for (i = cursorLine; i < totalLines; i++)
			data[i] = i;


		// start reading program from current cursor position
		if (stopOverview == false) {
			var sequence = Promise.resolve();    	     

			data.forEach(function(lineNumber) {

				sequence = sequence.then(function() {

					var data = CodeMirror.editor.getDoc().getLine(lineNumber);
                    console.log(data);
                    
					if (stopOverview == false)
						return sayItUsingPromise(data+'\n', lineNumber);
					else 
						return;
				})
			})
		} 
	} else { // read textarea contents, CodeMirror not loaded
		var no = document.getElementById("editorNumber").value;
		txtArea = document.getElementById('loquacious' +no);
		if (txtArea.addEventListener) 	{  // for all browsers except IE 8 and earlier
			txtArea.addEventListener("keydown", stopHighLevelOverview);
		}
		else if (txtArea.attachEvent) 	{ // for IE 8 and earlier
			txtArea.attachEvent("keydown", stopHighLevelOverview);
		}

		var stopOverview = false;  

		function stopHighLevelOverview(event) {

			//var key = event.keyCode;

			//console.log("stopped high level overview");
			stopOverview = true;
		}

		var lineNum = 1;
		var data = [];
		if (stopOverview == false) {
			//alert("in function overview loop");
			// Internet Explorer
			if (document.selection) {
				txtArea.focus();
				var Sel = document.selection.createRange();
				Sel.moveStart('character', -txtArea.value.length);
				cursorPos = Sel.text.length;
			}
			// Firefox, Safari support
			else if(txtArea.selectionStart || txtArea.selectionStart == '0')
				cursorPos = txtArea.selectionStart;       	  

			//alert("cursorPos = " +cursorPos);
			data = txtArea.value.substring(cursorPos).split("\n");
			var i = 0;

			for (var j in data) {
				data[j] = data[j] + "\n";
			}

			var sequence = Promise.resolve();
			lineNumber = txtArea.value.substring(0, cursorPos).split("\n").length;


			data.forEach(function(arrayData) {

				sequence = sequence.then(function() {
					lineNumber++;
					// match "def", "for", "while", and "#"
					// if ((arrayData.match(/^\s*def /) != null) || (arrayData.match(/^\s*for /) != null) || (arrayData.match(/^\s*while /) != null) || (arrayData.match(/^\s*#/) != null)) 
					//     ;
					// else {
					//  arrayData = "";
					// }

					//console.log("arrayData" +arrayData);
					if (stopOverview == false)
						return sayItUsingPromiseInTextarea(arrayData, lineNumber);
					else 
						return;
				})
			})

		}        
	}
}

function resetEditor(){

	swal2({
		title: 'Are you sure?',
		text: "This will erase the contents of the editor.",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		confirmButtonAriaLabel: 'Yes, erase contents',
	}).then((result) => {
		if (result.value) {

			var no = document.getElementById("editorNumber").value;
			if (!Loquacious.isTextarea) {   // clear CodeMirror if loaded, otherwise clear textarea
				CodeMirror.executeOnChangeEventHandlerExecuteOnChangeEventHandler = false;
				CodeMirror.editor.getDoc().setValue("");
				CodeMirror.executeOnChangeEventHandler = true;
			} else {                     
				document.getElementById("loquacious"+no).value = "";
			}

			document.getElementById("output" + no).textContent = "";
			meSpeak.stop();
		}
	});
}

/**
 * This function gives a high-level overview of the program by reading out comments, function definitions,
 * and for loops. As each line is read out, the cursor is positioned at the start of that line.
 * Pressing any key cancels the overview, and the programmer can start editing the program from the next line.
 * In addition, the overview starts from the current position of the cursor within the program.
 * Handles the case when CodeMirror is used or textarea is used for editing.
 *
 * @method overview
 */ 
function overview() {
	preload();
	meSpeak.stop();

	if (!Loquacious.isTextarea){ // ******read from CodeMirror *******
		if (!CodeMirror.editor.hasFocus())
			CodeMirror.editor.focus();

		var stopOverview = false; 

		// stop meSpeak on a keydown event
		CodeMirror.editor.on('keydown', stopHighLevelOverview);

		function stopHighLevelOverview(editor, event) {       
			var keyCode = event.which;
			//console.log("stopped high level overview");
			// stop if any key except Ctrl is pressed as Ctrl is used to stop screen reader announcements
			if (keyCode != 17) 
				stopOverview = true;
		}

		// get cursor's current line number
		var startCursor = CodeMirror.editor.getCursor();  
		var cursorLine = startCursor.line;

		var data = [];

		var totalLines = CodeMirror.editor.lineCount();

		for (i = cursorLine; i < totalLines; i++)
			data[i] = i;


		// start reading program from current cursor position
		if (stopOverview == false) {
			var sequence = Promise.resolve();    	     
			var skip = false;

			data.forEach(function(lineNumber) {
				sequence = sequence.then(function() {

					var data = CodeMirror.editor.getDoc().getLine(lineNumber);
					data = data + "\n";

					// match "def", "for", "while", and "#"
					if ((data.match(/^\s*def /) != null) || (data.match(/^\s*for /) != null) || (data.match(/^\s*while /) != null) || (data.match(/^\s*#/) != null)) 
						;
					else {
						data = "";
					}

					if (stopOverview == false)
						return sayItUsingPromise(data, lineNumber);
					else 
						return;
				})
			})
		} 
	} else {  // ************ Read from textarea *****************
		var no = document.getElementById("editorNumber").value;
		txtArea = document.getElementById('loquacious'+no);
		if (txtArea.addEventListener) 	{  // for all browsers except IE 8 and earlier
			txtArea.addEventListener("keydown", stopHighLevelOverview);
		}
		else if (txtArea.attachEvent) 	{ // for IE 8 and earlier
			txtArea.attachEvent("keydown", stopHighLevelOverview);
		}

		var stopOverview = false;  

		function stopHighLevelOverview(event) {

			//var key = event.keyCode;

			//console.log("stopped high level overview");
			stopOverview = true;
		}

		var lineNum = 1;
		var data = [];
		if (stopOverview == false) {
			//alert("in function overview loop");
			// Internet Explorer
			if (document.selection) {
				txtArea.focus();
				var Sel = document.selection.createRange();
				Sel.moveStart('character', -txtArea.value.length);
				cursorPos = Sel.text.length;
			}
			// Firefox, Safari support
			else if(txtArea.selectionStart || txtArea.selectionStart == '0')
				cursorPos = txtArea.selectionStart;       	  

			//alert("cursorPos = " +cursorPos);
			data = txtArea.value.substring(cursorPos).split("\n");
			var i = 0;
			var sequence = Promise.resolve();
			lineNumber = txtArea.value.substring(0, cursorPos).split("\n").length;
			data.forEach(function(arrayData) {

				sequence = sequence.then(function() {
					lineNumber++;
					// match "def", "for", "while", and "#"
					if ((arrayData.match(/^\s*def /) != null) || (arrayData.match(/^\s*for /) != null) || (arrayData.match(/^\s*while /) != null) || (arrayData.match(/^\s*#/) != null)) 
						;
					else {
						arrayData = "";
					}

					//console.log("arrayData" +arrayData);
					if (stopOverview == false)
						return sayItUsingPromiseInTextarea(arrayData, lineNumber);
					else 
						return;
				})
			})

		}
	}
}

/**
 * This function returns a Promise to set the cursor on the given line number and read data on that line in CodeMirror
 * @method sayItUsingPromise
 * @param {string} data the line to be spoken
 * @param {Number} lineNumber the line number of the spoken line
 */ 
function sayItUsingPromise(data, lineNumber) {
	return new Promise(function(resolve, reject) {
		//console.log( "in function sayItUsingPromise");
		//var no = document.getElementById("editorNumber").value;
		newData = punct(data); // convert punctuation to words

		console.log("say it 1");
		// setup meSpeak parameters
		var mespeakcookie = getCookie("isMeSpeak");
		if (mespeakcookie == "true") {
			var mespeakvariant = getCookie("mespeak_variant");
			var mespeakspeed = getCookie("mespeak_speed");
			mespeakspeed = mespeakspeed * 2;
		}

		console.log("say it 2");

		CodeMirror.editor.setCursor({line: lineNumber, ch: 0}); // position cursor on the line to be read
		console.log("say it 1");

		// read out the line
		meSpeak.stop();
		meSpeak.speak(newData, {"speed":mespeakspeed, "variant": mespeakvariant}, function() {
			//setCursorPosition(document.getElementById('loquacious'+no), lineNumber);
			resolve();
		});
		console.log("say it 4");

	});
}

/**
 * This function returns a Promise to set the cursor on the given line number and read data on that line in textarea
 * @method sayItWithPromise
 * @param {string} data the line to be spoken
 * @param {Number} lineNumber the line number of the spoken line
 */ 
function sayItUsingPromiseInTextarea(data, lineNumber) {
	return new Promise(function(resolve, reject) {
		//console.log( "in function sayItUsingPromise");
		var no = document.getElementById("editorNumber").value;
		newData = punct(data);
		var mespeakcookie = getCookie("isMeSpeak");
		if (mespeakcookie == "true") {
			var mespeakvariant = getCookie("mespeak_variant");
			var mespeakspeed = getCookie("mespeak_speed");
			mespeakspeed = mespeakspeed * 2;
		}
		meSpeak.stop();
		meSpeak.speak(newData, {"speed":mespeakspeed, "variant": mespeakvariant}, function() {
			setCursorPosition(document.getElementById('loquacious'+no), lineNumber);
			resolve();
		});
	});
}

/**
 * This function positions the cursor at the given line number in **textarea**
 *
 * @method setCursorPosition
 * @param {Object} txtArea the object in which to position the cursor
 * @param {Number} lineNumber number of the line on which to position the cursor
 */            
//function positions the cursor at the given number
function setCursorPosition(txtArea, lineNumber) { 
	data = txtArea.value.split("\n");
	var j = 0;
	var pos = 0;

	while ((j < lineNumber - 1) && (j < data.length)) {
		pos = pos + (data[j]).length + 1;
		j++;
	}

	//console.log("pos=" + pos);

	// works on Safari, Firefox
	if (txtArea.setSelectionRange) {
		txtArea.focus();
		txtArea.setSelectionRange(pos, pos);
		//console.log('Updated cursor position to ' +pos);
	} 
	// for Internet Explorer
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}


/**
 * This function is used to load configuration and voice files.
 * @method preload 
 */ 
function preload(){
	meSpeak.loadConfig('js/mespeak_config.json');
	meSpeak.loadVoice('js/voices/en/en.json');
}


/**
 * This function sets the output of the program
 * @method outf
 * @param {string} text the current output of the program
 */
function outf(text) { 
	//var no = document.getElementById("editorNumber").value;
	var mypre = document.getElementById("output"); 
	mypre.textContent += text; 
} 

/**
 * This function is event the handler for key presses.
 * Run: CTRL+SHIFT+r; Speak:CTRL+SHIFT+s; Overview:CTRL+SHIFT+o; Help:CTRL+SHIFT+h
 * @method handler_keyUp
 */
function handler_keyUp(e) {
	meSpeak.stop();

	var key = e.keyCode;
	// console.log("key code" +key);

	// if the up or down arrow key is pressed, speak line; 
	if (key == 38 || key == 40) {                    
		// var cursorPos = getCursorLineNumber();
		// sayit("line "+cursorPos);
		var linenum = getCursorLineNumber();
		data = txtArea.value.split("\n");
		meSpeak.stop();
		meSpeak.speak(punct(data[linenum-1]));
	}
	// if the right arrow key is pressed, read out the word or character after cursor
	else if (key == 39) {
		var text = getCursorText('right');
		meSpeak.stop();
		meSpeak.speak(punct(text));
	}
	// if the left arrow key is pressed, read out the word or character before cursor
	else if ( (key == 37) || (key == 8)) {
		var text = getCursorText('left');
		meSpeak.stop();
		meSpeak.speak(punct(text));
	} 

	// press the r, SHIFT and the CTRL keys at the same time
	else if (e.ctrlKey && e.keyCode == 82 && e.shiftKey) {
		// run the program
		runit();
	}

	// for speaking out the program, press the s, SHIFT, and the CTRL keys at the same time
	else if (e.ctrlKey && e.keyCode == 83 && e.shiftKey) {
		// speak out the program
		//sayit("");
		speak();
	}

	// for program overview, press the o, SHIFT, and the CTRL key at the same time
	else if (e.ctrlKey && e.keyCode == 79 && e.shiftKey) {
		// give a high level overview of program
		overview();
	}

	// press the n, SHIFT, and the CTRL key at the same time
	else  if (e.ctrlKey && e.keyCode == 78 && e.shiftKey) {
		var text = getCursorText('right');
		// speak out letter on right of cursor
		mespeak.stop();
		meSpeak.speak(text);

		//sayit(text);
	}

	// press the p, SHIFT, and the CTRL key at the same time
	else if (e.ctrlKey && e.keyCode == 80 && e.shiftKey) {
		var text = getCursorText('left');
		// speak out letter on left of cursor
		mespeak.stop();
		meSpeak.speak(text);

		// sayit(text);
	}

	// to speak line, press the l, SHIFT, and the CTRL key at the same time
	else if (e.ctrlKey && e.keyCode == 76 && e.shiftKey) {
		// speak the line on which cursor is positioned
		speakCursorLine() ;
	}

	// for help, press the h key, SHIFT key, and the CTRL key at the same time
	else if (e.ctrlKey && e.keyCode == 72 && e.shiftKey) {
		// give a high level overview of program
		preload();
		helpString = 	"Speak complete program: Ctrl + shift + s.\n" +
		"Run program: Ctrl + shift + r.\n" +
		"Program overview: Ctrl + shift + o.\n" +
		"Speak line: Ctrl + shift + l.\n" +
		"Speak letter after cursor: Ctrl + shift + n.\n" +
		"Speak letter before cursor: Ctrl + shift + p.\n" +
		"Go to the next book page: Ctrl + shift + right arrow key.\n" +
		"Go to the previous book page: Ctrl + shift + left arrow key.\n" +
		"Game help: Ctrl + shift + g";       
		swal({   title: "Keyboard Shortcuts.",   text: helpString,   timer: 22000 });
		speakNow(helpString);
	}
}

/**
 * This function speaks out the line on which the cursor is currently positioned. ** used in textarea **
 *
 * @method speakCursorLine
 */              
function speakCursorLine() {
	preload();     	  
	var linenum = getCursorLineNumber();
	data = txtArea.value.split("\n");
	speakNow(data[linenum-1]);
};

/**
 * This function returns the line number on which cursor is currently positioned in the editor.
 * It selects the code text area and splits it by the number of new line characters to get the line number.
 *
 * @method getCursorLineNumber
 */              
function getCursorLineNumber() {
	var no = document.getElementById("editorNumber").value;
	txtArea = document.getElementById('loquacious'+no);

	var cursorPos = 0;
	// Internet Explorer
	if (document.selection) {
		txtArea.focus();
		var Sel = document.selection.createRange();
		Sel.moveStart('character', -txtArea.value.length);
		cursorPos = Sel.text.length;
	}
	// Firefox, Safari support
	else if(txtArea.selectionStart || txtArea.selectionStart == '0')
		cursorPos = txtArea.selectionStart;       	  

	return (txtArea.value.substring(0, cursorPos).split("\n").length);
};

/**
 * This function returns the word or text following the cursor if right arrow is pressed;
 * otherwise, returns the text before the cursor if left arrow is pressed. ***Used for textarea ***
 *
 * @method getCursorText
 * @param {Number} keypressed number of the key pressed
 */                  
function getCursorText(keypressed) {
	var no = document.getElementById("editorNumber").value;
	txtArea = document.getElementById('loquacious'+no);

	var cursorPos = 0;
	// for Internet Explorer
	if (document.selection) {
		txtArea.focus();
		var select1 = document.selection.createRange();
		select1.moveStart('character', -txtArea.value.length);
		cursorPos = select1.text.length;
	}
	// Firefox, Safari support
	else if (txtArea.selectionStart || txtArea.selectionStart == '0')
		cursorPos = txtArea.selectionStart;

	if (keypressed == 'left')
		return (txtArea.value.substring(cursorPos-1, cursorPos));
	else
		return (txtArea.value.substring(cursorPos, cursorPos+1));
}

/**
 * This function registers a handler for keyup events.
 * @method addEventListenerToTextarea
 * @param {string} id of text area
 * Note: This method is not supported in Internet Explorer 8 and earlier versions
 */ 
function addEventListenerToTextarea(id) {
	document.getElementById(id).addEventListener('keyup', handler_keyUp);
}

function builtinRead(x) {
	if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
		throw "File not found: '" + x + "'";

	return Sk.builtinFiles["files"][x];
}

function speakNow(data) {
	var mespeakcookie = getCookie("isMeSpeak");
    console.log("In speaknow isMeSpeak is"+mespeakcookie);
	if (mespeakcookie === "true") {
		var mespeakvariant = getCookie("mespeak_variant");
		var mespeakspeed = getCookie("mespeak_speed");
		mespeakspeed = mespeakspeed * 2;
		mespeak.stop();
		meSpeak.speak(data, {"speed":mespeakspeed, "variant": mespeakvariant});
	}
	//else
	// meSpeak.speak(data);
}


//When a "keyHandled" event is triggered by pressing a key or "change" event is
//triggered by changing the CodeMirror DOM, the relevant data is announced by the screenreader
//using function screenreader(data). The relevant data is read from the editor
//into the field named Loquacious.ariaRegion. This field has an aria attribute of polite
//and it is set to offscreen so that that it is not visible on the page but changes in 
//this field are announced by the screenreader.
function createLoquaciousAriaRegion() {
	var myDiv = document.getElementById('body');
	var newDiv = document.createElement('div')
	myDiv.appendChild(newDiv);
	newDiv.setAttribute('id', 'accessibleEditor');
	newDiv.setAttribute('aria-live', 'assertive');
	newDiv.setAttribute('aria-atomic', 'false');
	Loquacious.ariaRegion = document.createElement('textarea');
	newDiv.appendChild(Loquacious.ariaRegion); 

	Loquacious.ariaRegion.setAttribute('id', 'LoquaciousAriaRegion');
	Loquacious.ariaRegion.setAttribute('aria-hidden', 'false');
	Loquacious.ariaRegion.setAttribute('aria-live', 'assertive');  // Opera and Safari
	//Loquacious.ariaRegion.setAttribute('style', 'display:block; height:1px; width:1px; left=-1000px; overflow:hidden; position:fixed');
	Loquacious.ariaRegion.setAttribute('class', 'visually-hidden');
	Loquacious.ariaRegion.setAttribute('aria-relevant', 'text');
}

//Puts the data to be spoken by screenreader in a region (Loquacious.ariaRegion) with an attribute of aria-live.
//By default, screen readers only read out data that has changed. So the previous data
//is recorded in the static variable previousData and compared with the new data. If there is no change, a new hidden
//textarea is created with an attribute of aria-live and the data to be spoken is put in this new textarea for the 
//screenreader.
function screenreader(data) {
	if (typeof screenreader.previousData == 'undefined')
		screenreader.previousData = "";
	// record the previous data  
	screenreader.previousData = data;
	Loquacious.ariaRegion.textContent = data;

	// if duplicate data, delete current aria region and create a new aria region with property aria live set to true
	if (data === screenreader.previousData) {
		var oldRegion = document.getElementById("LoquaciousAriaRegion");
		var myDiv = document.getElementById('accessibleEditor');
		Loquacious.ariaRegion = document.createElement('textarea');
		myDiv.appendChild(Loquacious.ariaRegion); 
		Loquacious.ariaRegion.setAttribute('id', 'LoquaciousAriaRegion');
		Loquacious.ariaRegion.setAttribute('aria-hidden', 'false');
		Loquacious.ariaRegion.setAttribute('aria-live', 'assertive'); 
		//Loquacious.ariaRegion.setAttribute('style', 'display:block; height:1px; width:1px; left=-1000px; overflow:hidden; position:fixed');
		Loquacious.ariaRegion.setAttribute('class', 'visually-hidden');

		Loquacious.ariaRegion.setAttribute('aria-relevant', 'additions text');
		oldRegion.parentNode.removeChild(oldRegion);
		screenreader.previousData = data;
		Loquacious.ariaRegion.textContent = data;
	} 


}


//call this function for any specific browser to attach aria-labels to all buttons given their ids
function addAriaLabelsToLoquaciousButtons(run, reset, speak, overview, settings) {
	document.getElementById(run).setAttribute("aria-label", "Test and save the program");
	document.getElementById(reset).setAttribute("aria-label", "Clear the program in the editor");
	document.getElementById(speak).setAttribute("aria-label", "Speak each line in program. Press right or left arrow key to stop cursor on desired line");
	document.getElementById(overview).setAttribute("aria-label", "Speak comments, function definitions, and loops in program");
	document.getElementById(settings).setAttribute("aria-label", "Modify accessibility settings");
}

// Describe the keys available in editor
function loquaciousHelp() {
    preload();

   var  helpString =
"<p style='text-align:left; font-size:14px !important; font-family:Georgia'><b>Up and down arrow keys</b> :    speak line under cursor.<br>" +
"<b>Right arrow key</b>:  speaks letter after cursor.<br>" +
"<b>Left arrow key</b>:  speaks letter before cursor.<br>" +
"<b>Backspace</b>: delete character before cursor. <br>"+
"<b>Ctrl + H on PC</b>: move cursor to start of document.<br>"+
"<b>Command + Up on Mac</b>: move cursor to start of document.<br>"+
"<b>Ctrl + End on PC</b>: move cursor to end of document.<br>"+
"<b>Command + Down on Mac</b>: move cursor to end of document.<br>"+
"<b>Alt + left arrow on PC</b>: move cursor to start of line.<br>"+
"<b>Ctrl + A on Mac</b>: move cursor to start of line.<br>"+
"<b>Ctrl + Z on PC or Command + Z on Mac</b>: undo the last change.<br>"+
"<b>Ctrl + D on PC or Cmd + D on Mac</b>: delete entire line under cursor.<br>"+
"<b>Alt + F (Mac only)</b>: move cursor to next word. <br>" +
"<b>Alt + B (Mac only)</b>: move cursor to previous word. <br></p><br> The last three commands are not available in the textarea";
    

	//speakNow(helpString);

swal2({   title: "Loquacious editor commands",   
	html: helpString,
   });
}


//detect Browser Type
function detectBrowserType() {
	var type = "undefined";

	// Edge 
	var isEdge = !isIE && !!window.StyleMedia;
	if (isEdge)
		type = "Edge";
	else {
		// Chrome
		var isChrome = !!window.chrome && !!window.chrome.webstore;
		if (isChrome)
			type = "Chrome";
		else {
			// Opera 
			var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			if (isOpera)
				type = "Opera";
			else {
				// Firefox 
				var isFirefox = typeof InstallTrigger !== 'undefined';
				if (isFirefox)
					type = "Firefox";
				else {
					// Safari
					var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
					if (isSafari)
						type = "Safari";
					else {
						// Internet Explorer
						var isIE = /*@cc_on!@*/false || !!document.documentMode;
						if (isIE)
							type = "IE";
					}
				}
			}
		}
	}
	return type;
}

function detectOS() {

	var platform = "other";
	if (navigator.appVersion.indexOf("Win")!=-1) 
		platform = "Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) 
		platform ="MacOS";

	if (navigator.appVersion.indexOf("Linux")!=-1) 
		platform ="Linux";

	return platform;		
}


//returns a flag of true if Loquacious editor with CodeMirror addon supports accessibility on a given platform, otherwise, false
function useCodeMirror(OSType, browserType) {
	var obj = {
			'MacOS' : {
				'Safari' : true,
				'Opera' : true,
				'Firefox': false,
				'Chrome' : false,
				'IE' : false,
				'Edge': false,
				'undefined':false

			},
			'Windows' : {
				'Firefox' : true,
				'Chrome' : true,
				'Opera' : true,
				'IE' : false,
				'Edge': false,
				'Safari': false,
				'undefined':false

			},
			'Linux' : {
				'Firefox' : false,
				'Chrome' : false,
				'Opera' : false,
				'IE' : false,
				'Edge': false,
				'Safari': false,
				'undefined':false

			},
			'other' : {
				'Firefox' : false,
				'Chrome' : false,
				'Opera' : false,
				'IE' : false,
				'Edge': false,
				'Safari': false,
				'undefined':false

			}
	};
	return obj[OSType][browserType];
}

