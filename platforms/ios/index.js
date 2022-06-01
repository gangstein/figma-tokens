import Color from 'tinycolor2';
import StringMath from 'string-math';
import { isFloat, isPercent } from '../common/utils.js';
import { isColor, isSize, isFontSize, isOpacityOrOther } from '../common/filters.js';

const colorTransform = (token) => {
    if (!token.value.includes('rgba')) {
        const { r, g, b, a } = Color(token.value).toRgb();
        const rFixed = (r / 255.0).toFixed(3);
        const gFixed = (g / 255.0).toFixed(3);
        const bFixed = (b / 255.0).toFixed(3);
        return `UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})`;
    }

    const [value, procent] = token.value.split(/\){1}[,|\s]*/);

    const alpha = procent.slice(0, -1) / 100;
    const [r, g, b] = value.replace('rgba(UIColor(', '').split(',').map((color) => parseFloat(color.split(': ')[1]));
    return `UIColor(red: ${r}, green: ${g}, blue: ${b}, alpha: ${alpha.toFixed(2)})`;
}

const getBasePxFontSize = (options) => {
    return (options && options.basePxFontSize) || 16;
}

const wrap = (value) => {
    return `CGFloat(${value})`;
}

const unwrap = (value) => {
    return value.replace('CGFloat(', '').replace(')', '');
}

const sizeTransform = (token, options) => {
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        return wrap(val.toFixed(0));
    }
    return wrap(StringMath(unwrap(token.value)));
}

const fontSizeTransform = (token, options) => {
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        const baseFont = getBasePxFontSize(options);
        return wrap(val * baseFont.toFixed(0));
    }
    return wrap(StringMath(unwrap(token.value)));
}

const opacityTransform = (token, options) => {
    if (isPercent(token.value)) {
        const percent = parseFloat(token.value.replace('%', '')) / 100;
        return wrap(percent.toFixed(2));
    }
    return wrap(StringMath(unwrap(token.value)));
}

function init(styleDictionary) {
    styleDictionary
        .registerTransform({
            name: 'color/ios/custom',
            type: 'value',
            transitive: true,
            matcher: isColor,
            transformer: colorTransform
        })
        .registerTransform({
            name: 'size/ios/custom',
            type: 'value',
            transitive: true,
            matcher: isSize,
            transformer: sizeTransform
        })
        .registerTransform({
            name: 'fontSize/ios/custom',
            type: 'value',
            transitive: true,
            matcher: isFontSize,
            transformer: fontSizeTransform
        })
        .registerTransform({
            name: 'other/ios/custom',
            type: 'value',
            transitive: true,
            matcher: isOpacityOrOther,
            transformer: opacityTransform
        })

    return styleDictionary.extend({
        platforms: {
            "ios-swift-separate-enums": {
                buildPath: 'build/ios-swift/',
                transforms: [
                    'attribute/cti',
                    'name/cti/camel',
                    'color/ios/custom',
                    'content/swift/literal',
                    'asset/swift/literal',
                    'size/ios/custom',
                    'fontSize/ios/custom',
                    'font/swift/literal',
                    'other/ios/custom'
                ],
                basePxFontSize: 1,
                files: [{
                    destination: 'StyleDictionarySize.swift',
                    format: 'ios-swift/enum.swift',
                    className: 'StyleDictionarySize',
                    filter: isSize
                }, {
                    destination: 'StyleDictionaryColor.swift',
                    format: 'ios-swift/enum.swift',
                    className: 'StyleDictionaryColor',
                    filter: isColor
                }, {
                    destination: 'StyleDictionaryFontSize.swift',
                    format: 'ios-swift/enum.swift',
                    className: 'StyleDictionaryFontSize',
                    filter: isFontSize
                }, {
                    destination: 'StyleDictionaryOther.swift',
                    format: 'ios-swift/enum.swift',
                    className: 'StyleDictionaryOther',
                    filter: isOpacityOrOther
                }]
            },
        }
    });
}

export default init;