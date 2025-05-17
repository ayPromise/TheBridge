export interface IChapter {
  id: number;
  documentId: string;
  title: string;
  paragraphs: IChapterParagraph[];
  epigraph?: IEpigraph;
}

type IEmphasis = {emphasis:string}

type INoteLink = {"#text":string, a:{"#text":string}}

export type IChapterParagraph = string | IEmphasis  | INoteLink

export interface IEpigraph{
  author:string;
  paragraphs: string[];
}