import path from 'path'
import XLSX from 'xlsx'

export interface Page {
  row: (row: number, mapped?: boolean) => string[] | Record<string, string>
  col: (col: number) => string[]
}

class ExcelPage implements Page {
  private page: XLSX.WorkSheet
  private range: XLSX.Range
  private headers: string[]

  constructor(sheet: XLSX.WorkSheet) {
    this.page = sheet
    this.range = XLSX.utils.decode_range(this.page['!ref' as string])
    this.headers = (this.row(0) as string[]).filter((item) => item)
  }

  row = (row: number, mapped?: boolean)
    : string[] | Record<string, string> => {
    const nthRow = []
    for (let colNum = this.range.s.c; colNum <= this.range.e.c; colNum++) {
      const ref = XLSX.utils.encode_cell({ r: row, c: colNum })
      nthRow.push(this.page[ref]?.v)
    }

    if (mapped) {
      return this.mapValueToKey(nthRow)
    }

    return nthRow
  }

  col = (col: number): string[] => {
    const nthCol = []
    for (let rowNum = this.range.s.r; rowNum <= this.range.e.r; rowNum++) {
      const ref = XLSX.utils.encode_cell({ r: rowNum, c: col })
      nthCol.push(this.page[ref]?.v)
    }

    return nthCol
  }

  private mapValueToKey = (row: string[]) => {
    const mapped: Record<string, string> = {}

    row.forEach((item, index) => {
      mapped[this.headers[index]] = item
    })

    return mapped
  }
}

export interface Book {
  page: (name: string) => Page
  pageNames: string[]
}

export class ExcelBook implements Book {
  private fileName: string
  private book: XLSX.WorkBook
  private pages: { [name: string]: Page }

  constructor(fileName: string) {
    this.fileName = path.resolve(__dirname, '../data/excel', fileName)
    this.book = XLSX.readFile(this.fileName)

    this.pages = {}

    this.book.SheetNames.forEach((sheet) => {
      this.pages[sheet] = new ExcelPage(this.book.Sheets[sheet])
    })
  }

  page = (name: string): Page => this.pages[name]
  get pageNames(): string[] {
    return this.book.SheetNames
  }
}
