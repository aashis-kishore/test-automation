import fs from 'fs'
import path from 'path'
import superagent, { SuperAgentRequest } from 'superagent'

export interface Builder {
  build: (url: string) => SuperAgentRequest
}

type Indexable = Record<string, any>

export class RequestBuilder implements Builder {
  private schemaPath: string
  private schema: Indexable
  private data: Record<string, string>

  constructor(schemaPath: string, data: Record<string, string>) {
    this.schemaPath = path.resolve(__dirname, '../data/input/', schemaPath)
    const schmeaStr = fs.readFileSync(this.schemaPath, 'utf8')
    this.schema = JSON.parse(schmeaStr)
    this.data = data
  }

  build = (url: string): SuperAgentRequest => {
    const preparedData = this.hydrate(this.schema, this.data)

    return superagent.post(url).send(preparedData)
  }

  private mapValue = (schema: Indexable, data: Record<string, string>)
    : Indexable => {
    const keys = Object.keys(schema)

    const tmpDoc: Indexable = {}

    keys.forEach((key) => {
      const replacable = schema[key]

      const dataKey = replacable.match(/^{{(.*)}}$/)[1]

      if (typeof replacable === 'string') {
        tmpDoc[key] = data[dataKey]
      } else if (typeof replacable === 'object') {
        tmpDoc[key] = this.hydrate(schema[key], data)
      } else if (Array.isArray(replacable)) {
        tmpDoc[key] = replacable
      }
    })

    return tmpDoc
  }

  private hydrate = (schema: Indexable, data: Record<string, string>)
    : Indexable => {
    if (Array.isArray(schema)) {
      return schema.map((subSchema) => this.mapValue(subSchema, data))
    }

    return this.mapValue(schema, data)
  }
}
