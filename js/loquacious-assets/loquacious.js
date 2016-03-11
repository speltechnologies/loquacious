/* ----------------------------------------------------------------------------
Copyright 2015 SPEL Technologies, Inc. All Rights Reserved.
    Authors: Pranav Grover and Rohan Grover
     
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
           
 
/**
* This function modifies the input to replace punctuation marks with the spoken word
* @method punc
* @param {string} input the input string
* @param {Array} chars is the array containing the word for each punctuation mark
* @return {string} the modified input
*/                
function punct(input, chars) {
    var output = "";
    var addedBoolCheck = false;
    if (chars == undefined) {
        var chars = [[" ampersand ", "&"], [" backslash ", "\\"], [" caret ", "^"], [" colon ",":"], [" comma ",","], [" dollar ", "$"], [" dot ","."], [" equals ","="], [" greater than ", ">"], [" less than ", "<"], [" exclamation ", "!"], [" hash ", "#"], [" left bracket ","["], [" left brace ","{"], [" left parenthesis ","("],  [" minus ","-"],  [" modulo ","%"], [" new line ", "\n" ], [" right parenthesis ",")"], [" slash ","/"],  [" plus ","+"], [" question mark ","?"], [" quotes ",'"'], [" quote ","'"], [" right brace ","}"], [" right bracket ","]"], [" semicolon ",";"], [" tilde ", "~"], [" tab ", "	"], [" times ", "*"], [" underscore ", "_"]];
    }
                      
    if (input == null) {
    	input = "";
    }
                
    var i = 0;
                
    while (i <= input.length-1) {
        // check for space
        if (input[i] == " ") {
            var num_spaces = 0;

            // count number of spaces
            while (input[i] == " ") {
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
            while ((k <= chars.length-1) && (match_found == false)) {
                if (input[i] == chars[k][1]) {
                    match_found = true;
                    output += ", "+ chars[k][0] + ", ";
                 }
                 k++;
             }
             
             // not a space or a punctuation mark
             if (match_found == false) {
            	 // if uppercase alphabetic character, prefix the word "capital" before it
                 if (input[i] == input[i].toUpperCase() && input[i]!==input[i].replace(/\D/g,''))
                    // output += ", " + "capital "  +input[i] +", "; 
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
* As each line is read out, the cursor is positioned at the start of that line.
* Pressing any key stops meSpeak, and the programmer can start editing the program from the next line.
* In addition, the overview starts from the current position of the cursor within the program.
* 
* To do: If the cursor is already at the end of the line, speak it aloud.
*
* @method sayit
* @param {string} currentString the input string
*/             
function sayit(currentString){
    if (currentString == "") {
        currentString = document.getElementById("loquacious").value;
    }
    preload();
                
    if (!speaking) {
        speaking=true;
        meSpeak.speak(punct(currentString));
    }
    speaking = false;
	
    
}
            
/**
* This function runs a python program.It
* gets the code from code area called "loquacious", and
* gets the reference to the pre element for output. It then
* calls Sk.importMainWithBody to run the program.
* After the program is run, it reads out either the output if the program ran successfully or the errors.
*
* @method runit
*/             
function runit() { 
    preload();
    var prog = document.getElementById("loquacious").value; 
    var mypre = document.getElementById("output"); 
                                     
    // preprocess prog          
    runprog();
                   
    function runprog() {
        mypre.innerHTML = ''; 
        Sk.pre = "output";
             
        Sk.configure({output:outf}); 
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
               
         var myPromise = Sk.misceval.asyncToPromise(function() {
             return Sk.importMainWithBody("<stdin>", false, prog, true);
         }); 
               		
         //var myPromise = Sk.importMainWithBody("<stdin>", false, prog, true);
               
         myPromise.then(function(mod) {
                 // speak out the output of the program
                 var mypre = document.getElementById("output"); 
                 //mypre.innerHTML += text; 
                 spokenWord=punct(mypre.innerHTML);
                 spokenWord=spokenWord.replace("\n", " , ");
                 console.log(spokenWord);
                 meSpeak.speak("The program output is, "+spokenWord); 
             },
             function(err) {
                 // speak out the first error in the program
                 str = err.toString();
                 meSpeak.speak(punct(str));
                 console.log(str);
                     
                 // extract the number of the line that has error
                 var substr = str.match(/line \d+/); 
                 //console.log(substr);
                 var lineNum = substr[0].replace(/\D/g, '');      
                 console.log("This line has error " +lineNum);
                     
                 // position cursor on line with error
                 setCursorPosition(document.getElementById('loquacious'), lineNum);
              });
         }; 
}

/**
* This function speaks out the complete program. As each line is read out, the cursor is positioned at the start of that line.
* Pressing any key cancels the overview, and the programmer can start editing the program from the next line.
* In addition, the overview starts from the current position of the cursor within the program.
*
* @method speak
*/ 
function speak() {
        preload();
        
	    txtArea = document.getElementById('loquacious');
        if (txtArea.addEventListener) 	{  // for all browsers except IE 8 and earlier
            txtArea.addEventListener("keydown", stopHighLevelOverview);
        }
        else if (txtArea.attachEvent) 	{ // for IE 8 and earlier
            txtArea.attachEvent("keydown", stopHighLevelOverview);
        }
        
        var stopOverview = false;  
        
        function stopHighLevelOverview(event) {
        
         //var key = event.keyCode;
       
            console.log("stopped high level overview");
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
    		          // if ((arrayData.match(/^\s*def /) != null) || (arrayData.match(/^\s*for /) != null) || (arrayData.match(/^\s*while /) != null) || (arrayData.match(/^\s*#/) != null)) 
    		          //     ;
    		          // else {
    		          //  arrayData = "";
    		          // }
    		     
    		          //console.log("arrayData" +arrayData);
    		          if (stopOverview == false)
    		              return sayItUsingPromise(arrayData, lineNumber);
    		          else 
    		              return;
    		       })
    		    })
    		         
        }         
 }


/**
* This function gives a high-level overview of the program by reading out comments, function definitions,
* and for loops. As each line is read out, the cursor is positioned at the start of that line.
* Pressing any key cancels the overview, and the programmer can start editing the program from the next line.
* In addition, the overview starts from the current position of the cursor within the program.
*
* @method overview
*/ 
function overview() {
        preload();
        
	    txtArea = document.getElementById('loquacious');
        if (txtArea.addEventListener) 	{  // for all browsers except IE 8 and earlier
            txtArea.addEventListener("keydown", stopHighLevelOverview);
        }
        else if (txtArea.attachEvent) 	{ // for IE 8 and earlier
            txtArea.attachEvent("keydown", stopHighLevelOverview);
        }
        
        var stopOverview = false;  
        
        function stopHighLevelOverview(event) {
        
         //var key = event.keyCode;
       
            console.log("stopped high level overview");
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
    		              return sayItUsingPromise(arrayData, lineNumber);
    		          else 
    		              return;
    		       })
    		    })
    		         
        }
           
 }

/**
* This function returns a Promise to set the cursor on the given line number and read data on that line.
* @method sayItWithPromise
* @param {string} data the line to be spoken
* @param {Number} lineNumber the line number of the spoken line
*/ 
function sayItUsingPromise(data, lineNumber) {
    return new Promise(function(resolve, reject) {
       //console.log( "in function sayItUsingPromise");
       newData = punct(data);
       meSpeak.speak(newData, {}, function() {
          setCursorPosition(document.getElementById('loquacious'), lineNumber);
          resolve();
       });
    });
}

/**
* This function is used to load configuration and voice files.
* @method preload 
*/ 
function preload(){
    meSpeak.loadConfig('src/mespeak_config.json');
    meSpeak.loadVoice('src/voices/en/en.json');
}
 

/**
* This function is used when the up, down, left or right arrow key is pressed
* It says the line number when the up or down key is pressed
* When the left arrow is pressed, it reads out the word or character before cursor
* When the right arrow is pressed, it reads out the word or character after cursor
*
* @method presslistener
* @param {Event} event is a key press
*/             
function pressListener(event) {
    
    //var key = event.which || event.keyCode;
    var key = event.keyCode;
    // console.log("key code" +key);
    // if the up or down arrow key is pressed read out the line number; 
    if (key == 38 || key == 40) {                    
        var cursorPos = getCursorLineNumber();
        sayit("line "+cursorPos);
    }
    // if the right arrow key is pressed, read out the word or character after cursor
    else if (key == 39) {
        var text = getCursorText('right');
        sayit(text);
    }
    // if the left arrow key is pressed, read out the word or character before cursor
    else if (key == 37) {
        var text = getCursorText('left');
        sayit(text);
    } 
};
   
/**
* This function returns the line number on which cursor is currently positioned in the editor.
* It selects the code text area and splits it by the number of new line characters to get the line number.
*
* @method getCursorLineNumber
*/              
function getCursorLineNumber() {
    txtArea = document.getElementById('loquacious');
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
* otherwise, returns the text before the cursor if left arrow is pressed.
*
* @method getCursorText
* @param {Number} keypressed number of the key pressed
*/                  
function getCursorText(keypressed) {
    txtArea = document.getElementById('loquacious');
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
* This function positions the cursor at the given line number.
*
* @method setCursorPosition
* @param {Object} txtArea the object in which to position the cursor
* @param {Number} lineNumber number of the line on which to position the cursor
*/            
// function positions the cursor at the given number
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
* This function sets the output of the program
* @method outf
* @param {string} text the current output of the program
*/
function outf(text) { 
   var mypre = document.getElementById("output"); 
   mypre.innerHTML += text; 
} 
 
/**
* This function is event the handler for key presses.
* Run: CTRL+SHIFT+r; Speak:CTRL+SHIFT+s; Overview:CTRL+SHIFT+o; Help:CTRL+SHIFT+h
* @method handler_keyUp
*/
function handler_keyUp(e) {

    // press the r, SHIFT and the CTRL keys at the same time
    if (e.ctrlKey && e.keyCode == 82 && e.shiftKey) {
        // run the program
        runit();
    }
    
     // press the s, SHIFT, and the CTRL keys at the same time
    if (e.ctrlKey && e.keyCode == 83 && e.shiftKey) {
        // speak out the program with the cursor control
        speak();
    }
    
    // press the o, SHIFT, and the CTRL key at the same time
    if (e.ctrlKey && e.keyCode == 79 && e.shiftKey) {
        // give a high level overview of program
        overview();
    }
    
    // for help, press the h key, SHIFT key, and the CTRL key at the same time
    if (e.ctrlKey && e.keyCode == 72 && e.shiftKey) {
        // give a high level overview of program
    	preload();
        helpString = "To speak complete program, press Ctrl, shift and the s keys together; To run the program, press the Ctrl, shift and r keys together; For program overview, press the Ctrl, Shift and o keys together";
        meSpeak.speak(helpString);
    }
}

/**
* This function registers a handler for keyup events.
* @method addEventListener
* @param {string} keyup
* @param {function} handler_keyUp
* @param {boolean} false
* Note: This method is not supported in Internet Explorer 8 and earlier versions
*/ 
document.addEventListener('keyup', handler_keyUp, false);