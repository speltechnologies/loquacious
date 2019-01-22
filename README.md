
## Loquacious
Loquacious is the world's first web-based Python IDE with speech integration. You can try out Loquacious [here] (https://www.speltechnologies.com/loquacious/).

## Motivation
With its built-in text-to-speech synthesizer (meSpeak), Loquacious offers features that screen readers cannot provide. Loquacious provides support for ARIA regions to work better with screenreaders. It gives the reader a choice to use CodeMirror, a plain textarea for editor, and meSpeak to provide support for more screenreader and browser combinations. 

## Installation
Loquacious is built using the open source programs meSpeak and Skulpt. The files needed to run the program are in the src folder:

loquacious.js: this file contains the code for Loquacious.

mespeak_config.json and mespeak.js :  these files are provided by meSpeak, an open source speech synthesizer program.

skulpt_modified.js and skulpt-stdlib.js : these files are provided by Skulpt, an open source implementation of Python.

The directory voices is provided by meSpeak and contains the speech modules used by meSpeak.

Copy the index.html file into a directory so it is one level above the src folder. The index.html file can be found in the doc folder. You can run the program in a browser or webserver.

## Contributing to Loquacious
There is still much to be done to improve Loquacious. To contribute:

1. Create a fork of the Loquacious repository. Do not clone this one.

2. After you've created a fork, you can clone it in your local machine's account.

3. Add new features. Commit and push to your forked version.

4. Make a pull request to get your new features added to the master.

If your request is accepted, your name will be included in the list of contributors

## API Reference
See the file global.html in the doc folder for a description of the methods in loquacious.js.

## History
Loquacious 2.0 released in October 2018. New features are listed below:
   - Includes support for ARIA regions in the editor. If data changes within an ARIA region, it will be spoken by the screenreader.
   - User has option to use a plain textarea or CodeMirror for editing code. CodeMirror is an open source editor that provides added functionality such as support for language modes and editing operations. However, screen readers are not able to read text written in CodeMirror. Loquacious supports accessibility through the use of ARIA regions.
   - Has an accessibility panel that user can use to switch to a textarea and/or enable meSpeak inside the editor
   - Eliminates conflict when a screen reader is used and meSpeak is also enabled.Uses the following priority order:
      if the meSpeak is enabled in Loquacious accessibility panel, the built-in text-to-speech reader is used to read the contents of Loquacious. Otherwise, the screenreader reads out the editor contents.

## List of Contributors
    Radhika Grover
    Pranav Grover
    Rohan Grover
    
Created by Pranav Grover and Rohan Grover in 2015.

## License
GPL v3 or later
