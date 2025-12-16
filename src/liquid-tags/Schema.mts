import { Tag } from 'liquidjs'

export default class SchemaTag extends Tag {
  constructor (tagToken: any, remainTokens: any, liquid: any) {
    super(tagToken, remainTokens, liquid);

    while (remainTokens.length) {
      const token = remainTokens.shift();
      if (token.name === 'endschema') return
    }
    throw new Error(`tag schema not closed`)
  }
  render () {
  }
}
