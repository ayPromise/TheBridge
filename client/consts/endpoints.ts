export const serverAPIRoutes = {
    books: '/api/books',
    chapters: '/api/chapters',
    notes: '/api/notes',
    singIn: '/api/auth/local',
    signUp: '/api/auth/local/register',
    chapterOfBook: (bookId:string, chapterId:string)=> `/api/books/${bookId}/chapters/${chapterId}`,
    chapterById:(chapterId:string) => `/api/chapters/${chapterId}`,
    bookById: (bookId: string) => `/api/books/${bookId}`,
    OAuthConnectStart: (provider:string) => `/api/connect/${provider}`,
    OAuthConnectFinal: (provider:string) => `/api/auth/${provider}/callback`,
  } as const;

  export const clientAPIRoutes = {
    createBook: `/api/books/create`,
    createChapters: `/api/chapters/create`,
    createNotes: `/api/notes/create`,
    updateBook: (bookId:number)=> `/api/books/${bookId}/update`,
    deleteBook: (bookId: number)=>`/api/books/${bookId}/delete`,
    chapterOfBook: (bookId:number, chapterId:number)=>`/api/books/${bookId}/chapters/${chapterId}`,
    updateChapter: (chapterId:number) => `/api/chapters/${chapterId}/update`
  }