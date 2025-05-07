
export default {
  routes: [
    {
      method: 'GET',
      path: '/books',
      handler: 'book.find',
      config: {
        policies: ['global::is-authenticated']
      },
    },
    {
      method: 'GET',
      path: '/books/:id',
      handler: 'book.findOne',
      config: {
        policies: ['global::is-authenticated']
      },
    },
    {
      method: 'POST',
      path: '/books',
      handler: 'book.create',
      config: {
        policies: ['global::is-authenticated']
      },
    },
    {
      method: 'PUT',
      path: '/books/:id',
      handler: 'book.update',
      config: {
        policies: ['global::is-authenticated']
      },
    },
    {
      method: 'DELETE',
      path: '/books/:id',
      handler: 'book.delete',
      config: {
        policies: ['global::is-authenticated']
      },
    },
  ],
};
