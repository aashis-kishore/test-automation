import superagent from 'superagent'
import { ExcelBook } from '../lib/book'

interface Post {
  id: number
  title: string
  author: string
}

const fileName = 'Post.xlsx'

describe.skip('Fetch Post', () => {
  test.skip('should have expected title', async () => {
    const res = await superagent.get('http://localhost:3000/posts/1')
    expect(res.status).toBe(200)
    const { title } = <Post> res.body
    expect(title).toBe('json-server')
  })

  test('should have expected status code', async () => {
    const excelBook = new ExcelBook(fileName)
    const funcPage = excelBook.page(excelBook.pageNames[0])
    const requestData = funcPage.row(1) as string[]
    const postId = requestData[1]
    const res = await superagent.get(`http://localhost:3000/posts/${postId}`)
    expect(res.status).toBe(200)
  })

  test('should create new post', async () => {
    const res = await superagent.post('http://localhost:3000/posts')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Why third posts matter?',
        author: 'Ajitha Kishore'
      })
    expect(res.status).toBe(201)
  })

  test('should delete post', async () => {
    const createRes = await superagent.post('http://localhost:3000/posts')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Why third posts matter?',
        author: 'Ajitha Kishore'
      })
    const { id } = <Post> createRes.body
    const deleteRes = await superagent
      .delete(`http://localhost:3000/posts/${id}`)
    expect(deleteRes.status).toBe(200)
  })
})
