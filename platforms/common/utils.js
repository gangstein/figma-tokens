const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';

const isFloat = (val) => {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

const isInt = (val) => {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

const isPercent = (val) => {
    var percentRegex = /^-?\d+(?:[.,]\d*?)?%$/;
    if (!percentRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

export {
    isFloat, isInt, isPercent, xmlHeader
}