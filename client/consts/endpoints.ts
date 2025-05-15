export const serverAPIRoutes = {
    books: '/api/books',
    chapters: '/api/chapters',
    notes: '/api/notes',
    singIn: '/api/auth/local',
    signUp: '/api/auth/local/register',
    chapterOfBook: (bookId:string, chapterId:string)=> `/api/books/${bookId}/chapters/${chapterId}`,
    bookById: (bookId: string) => `/api/books/${bookId}`,
    OAuthConnect: (provider:string) => `/api/auth/${provider}/callback`
  } as const;

  export const clientAPIRoutes = {
    OAuthConnect: (provider:string)=> `/api/connect/${provider}`,
    createBook: `/api/books/create`,
    createChapters: `/api/chapters/create`,
    createNotes: `/api/notes/create`
  }