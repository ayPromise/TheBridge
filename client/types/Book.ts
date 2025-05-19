export interface IBookDescriptionBlock {
  type: 'paragraph';
  children: {
    type: 'text';
    text: string;
  }[];
}

export interface IBookOwner {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  password: string | null;
  resetPasswordToken: string | null;
  confirmationToken: string | null;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
}

export interface IShortedChapter{
  title:string,
  id:number,
  completed:boolean
}

export interface IBook {
  id: number;
  documentId: string;
  title: string;
  language: string;
  description: IBookDescriptionBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  slug: string;
  date: string | null;
  owner: IBookOwner;

  chapters: IShortedChapter[]
  readingProgress?:IReadingProgress
}

export type IReadingProgress = {
  chapterId:number,
  paragraphIndex:number
}