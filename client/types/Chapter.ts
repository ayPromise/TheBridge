export interface IChapter {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  rawContent: IParagraphBlock[];
  epigraph?: IEpigraph;
}

export interface IEpigraph{
  author:string;
  rawContent: IParagraphBlock[];
}

export interface IParagraphBlock {
  type: "paragraph";
  children: ITextChild[];
}

export interface ITextChild {
  type: "text";
  text: string;
}