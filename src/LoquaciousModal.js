/* ----------------------------------------------------------------------------
   Loquacious v2.0 Copyright 2018 SPEL Technologies, Inc. All Rights Reserved.

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
    
      Script to update Accessibility Settings in Loquacious Editor
 ----------------------------------------------------------------------- */


function saveEditorSettings() {
	// var speedValue =
	// document.getElementById("setSpeedValue").getAttribute("aria-valuenow");


	var isTextarea = document.getElementById("setTextarea").checked;
	var isMeSpeakInEditor = document.getElementById("setMeSpeakInEditor").checked;

	// set global variables for Loquacious
	Loquacious.isTextarea = isTextarea;
	Loquacious.isMeSpeak= isMeSpeakInEditor;

	// Setting all the theme preferences in cookies
	var cookies = {};
	cookies['isTextarea'] = setCookie("isTextarea", isTextarea, 1, '');
	cookies['isMeSpeakInEditor'] = setCookie("isMeSpeakInEditor", isMeSpeakInEditor, 1, '');

	document.getElementById("modal_message").textContent = "Applied editor settings successfully";
	setTimeout(function(){
		document.getElementById("modal_message").textContent = "";
		// load/reload editor
		var no = document.getElementById("editorNumber").value;
		loadLoquaciousEditor("loquacious"+no); 
	}, 3000);

	


	// TO DO: add ajax call to store in back


}


function setEditorDefault(){
	var node = document.getElementById("body");

	if (document.getElementById('setTextarea') !== undefined && document.getElementById('setTextarea') !== null)
		document.getElementById('setTextarea').checked= false;

	if (document.getElementById('setMeSpeakInEditor') !== undefined && document.getElementById('setMeSpeakInEditor') !== null)
		document.getElementById('setMeSpeakInEditor').checked= false;

	// Resetting cookies
	setCookie("isTextarea", false, 1, '');
	setCookie("isMeSpeakInEditor", false, 1, '');

	document.getElementById("modal_message").textContent = "Editor settings reset!";
	setTimeout(function(){
		document.getElementById("modal_message").textContent = "";
	}, 3000);
}

/** Set editor style from cookies, loads/reloads the editor */

function setEditorStyleFromCookie(id) {

	Loquacious.isTextarea = false;
	Loquacious.isMeSpeak = false;

	// Setting checkboxes' status

	if (getCookie('isTextarea') !== undefined && document.getElementById("setTextarea") !== null) {
		if (getCookie("isTextarea") === "true"){
			document.getElementById("setTextarea").checked = true;
			Loquacious.isTextarea = true;
		} else {
			document.getElementById("setTextarea").checked = false;
			Loquacious.isTextarea = false;
		}

	}

	if (getCookie("isMeSpeakInEditor") !== undefined && document.getElementById("setMeSpeakInEditor") !== null) { 
		if (getCookie("isMeSpeakInEditor") === "true"){
			document.getElementById("setMeSpeakInEditor").checked = true;
			Loquacious.isMeSpeak = true;
		} else {
			document.getElementById("setMeSpeakInEditor").checked = false;
			Loquacious.setMeSpeak = false;
		}

	} 

	// load/reload editor
	loadLoquaciousEditor(id); 

}

function loadLoquaciousEditorSettingsAndEditor(id) {

	// TO DO: add ajax call to get from back

	setEditorStyleFromCookie(id);  // for users who are not logged in

}

//functions setCookie and getCookie are defined in slider.js
function setCookie(cookieName, cookieValue, cookieDuration, domain) {
	var domain_string = domain ? ("; domain=" + domain) : '';
	document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + "; max-age=" + 60 * 60 * 24 * cookieDuration + "; path=/" + domain_string;
	return cookieValue;
}
function getCookie(cookieName) {
	var re = new RegExp(cookieName + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}


/** JS code for Loquacious Modal follows **/
/**
MIT License

Copyright (c) 2016 - 2018

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Modified version available at
https://github.com/scottaohara/accessible_modal_window
 */

//helper function to place modal window as the first child
//of the #page node

function initModal() {
    console.log("In initModal()");
	var m = document.getElementById('modal_window'),
	p = document.getElementById('page');

	function swap () {
		if (m !== null)
			p.parentNode.insertBefore(m, p);
	}

	swap();

	'use strict';

//	list out the vars
	var mOverlay = getId('modal_window'),
	mOpen = getId('modal_open'),
	mClose = getId('modal_close'),
	modal = getId('modal_holder'),
	allNodes = document.querySelectorAll("*"),
	modalOpen = false,
	lastFocus;


//	Let's cut down on what we need to type to get an ID
	function getId ( id ) {
		return document.getElementById(id);
	}


//	Let's open the modal
	function modalShow () {
		// console.log("modal show");
		document.getElementById("modal_message").textContent = "";

		lastFocus = document.activeElement;
		mOverlay.setAttribute('aria-hidden', 'false');
		modalOpen = true;
		modal.setAttribute('tabindex', '0');
		modal.focus();
	}


//	binds to both the button click and the escape key to close the modal window
//	but only if modalOpen is set to true
	function modalClose ( event ) {
		if (modalOpen && ( !event.keyCode || event.keyCode === 27 ) ) {
			mOverlay.setAttribute('aria-hidden', 'true');
			modal.setAttribute('tabindex', '-1');
			modalOpen = false;
			lastFocus.focus();
		}
	}


//	Restrict focus to the modal window when it's open.
//	Tabbing will just loop through the whole modal.
//	Shift + Tab will allow backup to the top of the modal,
//	and then stop.
	function focusRestrict ( event ) {
		if ( modalOpen && !modal.contains( event.target ) ) {
			event.stopPropagation();
			modal.focus();
		}
	}


//	Close modal window by clicking on the overlay
	mOverlay.addEventListener('click', function( e ) {
		if (e.target == modal.parentNode) {
			modalClose( e );
		}
	}, false);


//	open modal by btn click/hit
	mOpen.addEventListener('click', modalShow);

//	close modal by btn click/hit
	mClose.addEventListener('click', modalClose);

//	close modal by keydown, but only if modal is open
	document.addEventListener('keydown', modalClose);

//	restrict tab focus on elements only inside modal window
	for (var i = 0; i < allNodes.length; i++) {
		allNodes.item(i).addEventListener('focus', focusRestrict);
	}

}

