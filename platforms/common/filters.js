const isColor = (token) => {
    return token.type === 'color';
}

const isSize = (token) => {
    return token.type === 'borderRadius' || token.type === 'sizing' || token.type === 'spacing';
}

const isFontSize = (token) => {
    return token.type === 'fontSizes';
}

const isFontAndSize = (token) => {
    return isFontSize(token) || isSize(token);
}

const isOpacityOrOther = (token) => {
    return token.type === 'opacity' || token.type === 'other';
}

const allCustom = (token) => {
    return token.type === 'color' || token.type === 'borderRadius' || token.type === 'sizing' || token.type === 'spacing' || token.type === 'opacity' || token.type === 'other';
}

export {
    isColor, isSize, isFontSize, isFontAndSize, isOpacityOrOther, allCustom
}