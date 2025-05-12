export interface IChapter {
  id: number;
  documentId: string;
  title: string;
  paragraphs: string[];
  epigraph?: IEpigraph;
}

export interface IEpigraph{
  author:string;
  paragraphs: string[];
}