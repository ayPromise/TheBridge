import type { IEpigraph } from "./Chapter";
import type { FB2_INote } from "./FB2File";

export interface BookRelation{
    connect: {documentId:string, status:string}[]
}

// BOOK
export interface IBookPayload {
    title: string;
    author: {
        firstName: string,
        middleName?: string,
        lastName:string
    };
}


// NOTES
export interface INotesPayload{
    book:BookRelation,
    notes:FB2_INote[]
}

// CHAPTERS
export interface IChaptersPayload{
    title: string,
    paragraphs:string[],
    book:BookRelation,
    epigraph?: IEpigraph
}

export interface Payload<T> {
    data: T,
    entityType: string;
}