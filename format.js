const hexToRgba = require('hex-to-rgba');

const formatColor = (value) => {
  if (!value.includes('rgba')) {
    return value;
  }

  const [left, right] = value.split(' ');

  return hexToRgba(left.replace(/,/, '').replace(/rgba\(/, ''), right.slice(0, -2) / 100)
}

const formatValue = ({ type, value }) => {
  if (type === 'boxShadow' && Array.isArray(value)) {
    const [first] = value;
    if (!first) {
      return value
    }

    const directionShadow = first.type === 'innerShadow' ? 'inset ' : '';

    return `${directionShadow}${first.x}px ${first.y}px ${first.blur}px ${first.spread}px ${formatColor(first.color)}`
  }

  if (type === 'color') {
    return formatColor(value)
  }

  if (type === 'borderRadius') {
    return `calc(${value.split(' * ').map((v, i) => i === 0 ? `${v}px` : ` * ${v}`).join('')})`
  }

  if (['fontSizes', 'sizing', 'spacing', 'borderWidth', 'letterSpacing'].includes(type)) {
    return `${value}px`
  }

  if (['fontFamilies', 'fontWeights'].includes(type)) {
    return `'${value}'`
  }

  return value;
}

const scssFormatter = ({ dictionary }) => dictionary.allTokens.map((item) => `$${item.name}: ${formatValue(item)};`).join('\n');
const cssFormatter = ({ dictionary }) => `:root {\n${dictionary.allTokens.map((item) => `\t--${item.name}: ${formatValue(item)};`).join('\n')}\n}`;

module.exports = {
  scssFormatter,
  cssFormatter,
}
