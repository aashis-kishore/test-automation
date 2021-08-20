describe('user test suite', () => {
  test('should create user', async () => {
    const mockCreate = () => Promise.resolve({
      id: '02051322-1523-4a25-aa6e-9fb02eb56003',
      name: 'Sample User'
    })

    const createdUser = await mockCreate()

    expect(createdUser.name).toEqual('Sample User')
  })

  // eslint-disable-next-line jest/expect-expect
  test('should update user', async () => {
    const failingMockUpdate = () => Promise
      .reject(new Error('Could not update user'))

    await failingMockUpdate()
  })
})
