import Color from 'tinycolor2';
import StringMath from 'string-math';
import { isFloat, isPercent } from '../common/utils.js';
import StyleDictionary from 'style-dictionary';
const { formatHelpers } = StyleDictionary;
import { isColor, isSize, isFontSize, isOpacityOrOther } from '../common/filters.js';

const colorTransform = (token) => {
    if (!token.value.includes('rgba')) {
        var str = Color(token.value).toHex8();
        return 'Color(0x' + str.slice(6) + str.slice(0, 6) + ')';
    }

    const [value, procent] = token.value.split(' ');
    const alpha = procent.slice(0, -2) / 100;
    var str = Color('#' + value.replace(')', '').replace('rgba(Color(0x', '').replace(',', '').slice(2)).setAlpha(alpha).toHex8();
    return 'Color(0x' + str.slice(6) + str.slice(0, 6) + ')';
}

const getBasePxFontSize = (options) => {
    return (options && options.basePxFontSize) || 16;
}

const dpTransform = (token, options) => {
    const appendix = '.dp';
    if (isFloat(token.value)) {
        const val = parseFloat(token.value);
        const baseFont = getBasePxFontSize(options);
        return (val * baseFont).toFixed(0) + appendix;
    }
    return StringMath(token.value.replace(appendix, '')) + appendix;
}

const spTransform = (token, options) => {
    const appendix = '.sp';
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
    '\n' + formatHelpers.fileHeader({ file, commentStyle: 'short' }) + '\n\n' +
    `package ${file.packageName} \n\n` +
    `import androidx.compose.ui.graphics.Color\n` +
    `import androidx.compose.ui.unit.* \n\n` +
    `object ${file.className} {\n` +
    dictionary.allTokens.map((prop) => `  val ${prop.name} = ${prop.value}`).join('\n') +
    `\n}`

function init(styleDictionary) {
    styleDictionary
        .registerTransform({
            name: 'color/compose/custom',
            type: 'value',
            transitive: true,
            matcher: isColor,
            transformer: colorTransform
        })
        .registerTransform({
            name: 'sp/compose/custom',
            type: 'value',
            transitive: true,
            matcher: isFontSize,
            transformer: spTransform
        })
        .registerTransform({
            name: 'dp/compose/custom',
            type: 'value',
            transitive: true,
            matcher: isSize,
            transformer: dpTransform
        })
        .registerTransform({
            name: 'opacity/compose/custom',
            type: 'value',
            transitive: true,
            matcher: isOpacityOrOther,
            transformer: opacityTransform
        })
        .registerFormat({
            name: 'format/compose/other',
            formatter: floatFormatter,
        })

    return styleDictionary.extend({
        platforms: {
            compose: {
                transforms: [
                    'attribute/cti',
                    'name/cti/camel',
                    'color/compose/custom',
                    'sp/compose/custom',
                    'dp/compose/custom',
                    'opacity/compose/custom'
                ],
                buildPath: 'build/compose/',
                basePxFontSize: 1,
                files: [{
                    destination: 'StyleDictionaryColor.kt',
                    format: 'compose/object',
                    className: 'StyleDictionaryColor',
                    packageName: 'StyleDictionaryColor',
                    filter: isColor
                }, {
                    destination: 'StyleDictionarySize.kt',
                    format: 'compose/object',
                    className: 'StyleDictionarySize',
                    packageName: 'StyleDictionarySize',
                    type: 'float',
                    filter: isSize
                }, {
                    destination: 'StyleDictionaryFontSize.kt',
                    format: 'compose/object',
                    className: 'StyleDictionaryFontSize',
                    packageName: 'StyleDictionaryFontSize',
                    type: 'float',
                    filter: isFontSize
                },
                {
                    destination: 'StyleDictionaryOther.kt',
                    format: 'format/compose/other',
                    className: 'StyleDictionaryOther',
                    packageName: 'StyleDictionaryOther',
                    type: 'float',
                    filter: isOpacityOrOther
                }]
            }
        }
    });
}

export default init;