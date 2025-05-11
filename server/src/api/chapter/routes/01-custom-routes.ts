export default {routes:[
    {
      method:'GET',
      path:'/books/:id/chapters',
      handler: 'chapter.find',
      config:{
        policies: ['global::is-authenticated'],
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
    }
  ]}