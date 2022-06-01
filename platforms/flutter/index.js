import Color from 'tinycolor2';
import StringMath from 'string-math';
import { isFloat, isPercent } from '../common/utils.js';
import { isColor, isSize, isFontSize, isOpacityOrOther, allCustom } from '../common/filters.js';
const appendix = ';';

const colorTransform = (token) => {
    if (!token.value.includes('rgba')) {
        var str = Color(token.value).toHex8();
        return 'Color(0x' + str.slice(6) + str.slice(0, 6) + ')';
    }

    const [value, procent] = token.value.split(' ');
    const alpha = procent.slice(0, -2) / 100;
    var str = Color('#' + value.replace(')', '').replace('rgba(Color(0x', '').replace(',', '').replace(appendix, '').slice(2)).setAlpha(alpha).toHex8();
    return 'Color(0x' + str.slice(6) + str.slice(0, 6) + ')';
}

const getBasePxFontSize = (options) => {
    return (options && options.basePxFontSize) || 16;
}

const dpTransform = (token, options) => {
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        const baseFont = getBasePxFontSize(options);
        return (val * baseFont).toFixed(0);
    }
    return StringMath(token.value.replace(appendix, ''));
}

const spTransform = (token, options) => {
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        const baseFont = getBasePxFontSize(options);
        return (val * baseFont).toFixed(0);
    }
    return StringMath(token.value.replace(appendix, ''));
}

const opacityTransform = (token, options) => {
    if (isPercent(token.value)) {
        const percent = parseFloat(token.value.replace('%', '')) / 100;
        return percent.toFixed(2);
    }
    return StringMath(token.value);
}

function init(styleDictionary) {
    styleDictionary
        .registerTransform({
            name: 'color/flutter/custom',
            type: 'value',
            transitive: true,
            matcher: isColor,
            transformer: colorTransform
        })
        .registerTransform({
            name: 'sp/flutter/custom',
            type: 'value',
            transitive: true,
            matcher: isFontSize,
            transformer: spTransform
        })
        .registerTransform({
            name: 'dp/flutter/custom',
            type: 'value',
            transitive: true,
            matcher: isSize,
            transformer: dpTransform
        })
        .registerTransform({
            name: 'opacity/flutter/custom',
            type: 'value',
            transitive: true,
            matcher: isOpacityOrOther,
            transformer: opacityTransform
        })

    return styleDictionary.extend({
        platforms: {
            flutter: {
                buildPath: 'build/flutter/',
                basePxFontSize: 1,
                transforms: [
                    'attribute/cti',
                    'name/cti/camel',
                    'color/flutter/custom',
                    'sp/flutter/custom',
                    'dp/flutter/custom',
                    'opacity/flutter/custom',
                    'content/flutter/literal',
                    'asset/flutter/literal',
                    'font/flutter/literal'
                ],
                files: [
                    {
                        destination: 'style_dictionary.dart',
                        format: 'flutter/class.dart',
                        className: 'StyleDictionary',
                        filter: allCustom
                    }
                ]
            }
        }
    });
}

export default init;