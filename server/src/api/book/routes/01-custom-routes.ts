export default {routes:[
    {
      method:'PATCH',
      path:'/books/:id',
      handler: 'book.update',
      config:{
        policies: ['global::is-authenticated'],
        middleware:[]
      }
    },
  ]}