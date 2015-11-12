
## Loquacious
Loquacious is the world's first web-based talking Python IDE. You can try out Loquacious [here] (http://speltechnologies.github.io/loquacious/).

## Motivation
With its built-in text-to-speech synthesizer (meSpeak), Loquacious offers features that screen readers cannot provide. 

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

## API Reference
See the file global.html in the doc folder for a description of the methods in loquacious.js.

## History
Created by Pranav Grover and Rohan Grover in 2015.

## License
GPL v3 or later
