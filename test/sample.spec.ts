const superagent = require('superagent')

interface Post {
  id: number
  title: string
  author: string
}

test('should have expected title', async () => {
  try {
    const res = await superagent.get('http://localhost:3000/posts/1')
    expect(res.status).toBe(200)
    const { title } = <Post> res.body
    expect(title).toBe('json-server')
  } catch (err) {
    console.error(err)
  }
})
