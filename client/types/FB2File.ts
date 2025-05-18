export interface FB2_INote {
    title:{p:number};
    p: string;
}

export interface FB2_IDescription {
    "title-info":FB2_ITitleInfo
}

export interface FB2_IAuthor{
    "first-name":string,
    "middle-name"?:string,
    "last-name":string
}


export interface FB2_ITitleInfo{
    author:FB2_IAuthor;
    "book-title":string;
}


export interface FB2_IChapter {
    title: {p:string};
    p: string[];
    epigraph?:{
        "text-author":string;
        p:string[];
    }
}

export interface FB2_ISection {
    title: {p:string};
    section: FB2_IChapter[];
}
  
export interface FB2_IBody {
    title:string;
    section: FB2_IChapter[] | FB2_INote[] | FB2_ISection[];
}

export interface FB2_IBook{
    body: FB2_IBody[],
    description:FB2_IDescription
}
  