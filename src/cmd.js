module.exports = () => {
    const arguments = process.argv.slice (2);
    const data = { _: [] };

    // Parse -- 
    const doubleDash = arguments.findIndex (itm => itm === "--");
    if (doubleDash >= 0) arguments.splice (doubleDash).forEach (data._.push.bind (data));

    // Parse flags
    arguments.filter (itm => /-[a-z0-9]+/i.test (itm)).forEach (itm => itm.split ("").forEach (itm => data [itm] = true));


    return data;
}