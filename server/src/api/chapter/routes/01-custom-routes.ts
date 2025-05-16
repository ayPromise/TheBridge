export default {routes:[
    {
      method:'GET',
      path:'/chapters',
      handler: 'chapter.findAll',
      config:{
        policies: ['global::is-admin'],
        middleware:[]
      }
    },
    {
      method:'GET',
      path:'/books/:bookId/chapters/:chapterId',
      handler: 'chapter.findChapter',
      config:{
        policies: ['global::is-authenticated'],
        middleware:[]
      }
    },
    {
      method:"DELETE",
      path:'/chapters',
      handler:"chapter.deleteAll",
      config:{
        policies:["global::is-admin"],
        middleware:[]
      }
    }
  ]}