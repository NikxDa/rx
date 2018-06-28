#!/usr/local/bin/node

// rx by NikxDa

// Dependencies
const minimist = require ("minimist");

// Read arguments
const argv = minimist (process.argv.slice (2), {
    boolean: ["e", "i"],
    string: [0, 2],
    alias: {
        e: ["extract"],
        i: ["insensitive"]
    }
});

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