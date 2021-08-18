import fs from 'fs'
import path from 'path'
import superagent, { SuperAgentRequest } from 'superagent'

export interface Builder {
  build: (url: string) => SuperAgentRequest
}

type Indexable = Record<string, any>

export class RequestBuilder
  <
    SchemaType extends Indexable,
    DataType extends Indexable
  > implements Builder {
  private schemaPath: string
  // private schema: SchemaType
  private data: DataType
  private unPreparedData: SchemaType

  constructor(schemaPath: string, data: DataType) {
    this.schemaPath = path.resolve(__dirname, '../data/input/', schemaPath)
    const schmeaStr = fs.readFileSync(this.schemaPath, 'utf8')
    // this.schema = JSON.parse(schmeaStr)
    this.unPreparedData = JSON.parse(schmeaStr)
    this.data = data
  }

  build = (url: string): SuperAgentRequest => {
    const preparedData = this.hydrate()

    return superagent.post(url).send(preparedData)
  }

  private hydrate = (): SchemaType => {
    const keys = Object.keys(this.unPreparedData)

    keys.forEach((key) => {
      const replacable = this.unPreparedData[key]

      if (!replacable) {
        throw new Error('value not found')
      }

      const regexArr = replacable.match(/^{{(.*)}}$/)

      if (!regexArr) {
        throw new Error('no match found')
      }

      const dataKey = regexArr[1]

      // this.unPreparedData[key] = this.data[dataKey]
      this.unPreparedData = {
        ...this.unPreparedData,
        [key]: this.data[dataKey]
      }
    })

    return this.unPreparedData
  }
}
