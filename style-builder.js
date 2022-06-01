class StyleBuilder {
  constructor(styleDictionary) {
    this.styleDictionary = styleDictionary
  }

  extendWith(block) {
    this.styleDictionary = block(this.styleDictionary);
    return this;
  }

  build() {
    this.styleDictionary.buildAllPlatforms()
  }
}

function initWith(styleDictionary) {
  return new StyleBuilder(styleDictionary);
}

export default initWith;