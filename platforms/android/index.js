import Color from 'tinycolor2';
import StringMath from 'string-math';
import { isFloat, isPercent, xmlHeader } from '../common/utils.js';
import StyleDictionary from 'style-dictionary';
const { formatHelpers } = StyleDictionary;
import { isColor, isSize, isFontSize, isOpacityOrOther } from '../common/filters.js';

const colorTransform = (token) => {
    if (!token.value.includes('rgba')) {
        var str = Color(token.value).toHex8();
        return '#' + str.slice(6) + str.slice(0, 6);
    }
    const [value, procent] = token.value.split(' ');
    const alpha = procent.slice(0, -2) / 100;
    var str = Color(value.replace(/,/, '').replace(/rgba\(/, '').replace('#', '').slice(2)).setAlpha(alpha).toHex8();
    return '#' + str.slice(6) + str.slice(0, 6);
}

const getBasePxFontSize = (options) => {
    return (options && options.basePxFontSize) || 16;
}

const dpTransform = (token, options) => {
    const appendix = 'dp';
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        const baseFont = getBasePxFontSize(options);
        return (val * baseFont).toFixed(0) + appendix;
    }
    return StringMath(token.value.replace(appendix, '')) + appendix;
}

const spTransform = (token, options) => {
    const appendix = 'sp';
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        const baseFont = getBasePxFontSize(options);
        return (val * baseFont).toFixed(0) + appendix;
    }
    return StringMath(token.value.replace(appendix, '')) + appendix;
}

const floatTransform = (token, options) => {
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        return val.toFixed(1);
    }
    return StringMath(token.value);
}

const opacityTransform = (token, options) => {
    if (isPercent(token.value)) {
        const percent = parseFloat(token.value.replace('%', '')) / 100;
        return percent.toFixed(2);
    }
    return StringMath(token.value);
}

const floatFormatter = ({ dictionary, options, file }) =>
    xmlHeader +
    formatHelpers.fileHeader({ file, commentStyle: 'xml' }) + '\n' +
    '<resources>\n' +
    dictionary.allTokens.map((prop) => `  <${file.resourceType} name="${prop.name}" type="integer">${prop.value}</${file.resourceType}>`).join('\n') + '\n' +
    '</resources>';

function init(styleDictionary) {
    styleDictionary
        .registerTransform({
            name: 'color/android/custom',
            type: 'value',
            transitive: true,
            matcher: isColor,
            transformer: colorTransform
        })
        .registerTransform({
            name: 'dp/android/custom',
            type: 'value',
            transitive: true,
            matcher: isSize,
            transformer: dpTransform
        })
        .registerTransform({
            name: 'sp/android/custom',
            type: 'value',
            transitive: true,
            matcher: isFontSize,
            transformer: spTransform
        })
        .registerTransform({
            name: 'float/android/custom',
            type: 'value',
            transitive: true,
            matcher: function (token) {
                return token.type === 'other' && token.attributes.type === 'multiplier';
            },
            transformer: floatTransform
        })
        .registerTransform({
            name: 'opacity/android/custom',
            type: 'value',
            transitive: true,
            matcher: isOpacityOrOther,
            transformer: opacityTransform
        })
        .registerFormat({
            name: 'itemFloatFormat',
            formatter: floatFormatter,
        })

    return styleDictionary.extend({
        platforms: {
            android: {
                transforms: [
                    'attribute/cti',
                    'name/cti/snake',
                    'color/android/custom',
                    'dp/android/custom',
                    'sp/android/custom',
                    'float/android/custom',
                    'opacity/android/custom'
                ],
                buildPath: 'build/android/res/values/',
                basePxFontSize: 1,
                files: [
                    {
                        destination: 'token_colors.xml',
                        format: 'android/resources',
                        filter: isColor,
                        resourceType: 'color'
                    },
                    {
                        destination: 'token_dimens.xml',
                        format: 'android/resources',
                        filter: isSize,
                        resourceType: 'dimen'
                    },
                    {
                        destination: 'token_font_dimens.xml',
                        format: 'android/resources',
                        filter: isFontSize,
                        resourceType: 'dimen'
                    },
                    {
                        destination: 'token_other.xml',
                        format: 'itemFloatFormat',
                        filter: function (token) {
                            return token.type === 'other' || token.type === 'opacity'
                        },
                        resourceType: 'item'
                    }
                ]
            }
        }
    })
}

export default init;