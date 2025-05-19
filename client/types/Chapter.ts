import type { IBook } from "./Book";

export interface IChapter {
  id: number;
  documentId: string;
  title: string;
  paragraphs: IChapterParagraph[];
  epigraph?: IEpigraph;
  book:IBook;
  completed:boolean
}

type IEmphasis = {emphasis:string}

type INoteLink = {"#text":string, a:{"#text":string}}

export type IChapterParagraph = string | IEmphasis  | INoteLink

export interface IEpigraph{
  author:string;
  paragraphs: string[];
}