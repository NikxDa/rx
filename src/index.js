#!/usr/local/bin/node

// rx by NikxDa

// Dependencies
const parseCmd = require ("./cmd");

// Read arguments
const argv = parseCmd ();
console.log (argv);

// Allow piping input
const stdIn = process.stdin;
stdIn.resume ();

// Await data
let pipeData = "";
stdIn.on ("data", (chunk) => pipeData += chunk);
stdIn.on ("end", () => pipeFinished (pipeData));

// Handle data
function pipeFinished (pipeData) {
    // Fetch arguments
    const regexValue = argv._ [0] || finalize (pipeData);
    const replaceValue = argv._ [1] || "$&";
    
    // Read lines
    const lines = pipeData.split ("\n");

    // Parse regex flags
    const flags = ["g"];
    if (argv.i) flags.push ("i");

    // Create regular expression
    const regExp = new RegExp (regexValue, flags.join (""));

    // Iterate
    for (let i = 0; i < lines.length; i++) {
        // Read current line
        const currentLine = lines [i];

        // Match
        if (regExp.test (currentLine)) {
            // Match the current line and print
            let lineMatch = currentLine;

            // Match for replacing
            if (argv.e || argv.extract) {
                lineMatch = lines [i].match (regExp)[0];
            }

            // Replace and print
            lineMatch = lineMatch.replace (regExp, replaceValue);
            process.stdout.write (`${lineMatch}\n`);
        }
    }

    // Exit
    process.exit ();
}

// Print data and quit
function finalize (data) {
    process.stdout.write (data);
    process.exit ();
}

// Parse command line arguments
function parseCommandLineArgs () {
    // Grab arguments
    const arguments = process.argv.slice (2);

    // Specify data
    const data = {}

    for (let arg of arguments) {
        // What type do we have?
        if (arg.startsWith ("--")) {
            data [arg.substr (2)] = true;
        } else if (arg.startsWith ("-")) {
            const flags = arg.substr (1);
            flags.split ("").forEach (itm => data [itm] = true)
        } else {
            data._ = [...(data._ || []), arg];
        }
    }

    return data;
}

/*
Flags:
e - extract - Extracts the matched regex string
g - global - Does not split at newline characters
i - insensitive - Case insensitive matching
*/