import { ExcelBook } from '../lib/book'
import { RequestBuilder } from '../lib/builder'

const fileName = 'Post.xlsx'

describe('Create Post', () => {
  test('should create post', async () => {
    const book = new ExcelBook(fileName)
    const createPage = book.page(book.pageNames[1])
    const schemaPath = (createPage.row(1) as string[])[1]
    const data = createPage.row(1, true) as Record<string, string>
    const rb = new RequestBuilder(schemaPath, data)

    const res = await rb.build('http://localhost:3000/posts')
    expect(res.status).toBe(201)
  })
})
