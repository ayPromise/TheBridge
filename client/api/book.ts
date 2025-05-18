import { clientAPIRoutes } from "consts/endpoints";
import type { IBook } from "types/Book";
import type { IChapter } from "types/Chapter";
import type { IBookPayload, Payload } from "types/Payloads";


type FetchChapter = {bookId:number, chapterId:number}
const fetchChapter = async ({bookId, chapterId}:FetchChapter) : Promise<IChapter> =>{
    const res = await fetch(clientAPIRoutes.chapterOfBook(bookId, chapterId))
    if (!res.ok) throw new Error('Failed to fetch chapter');
    return await res.json()
}

type UpdateBookMutation = {bookId:number, payload:any}
const updateBook = async ({bookId, payload}:UpdateBookMutation) : Promise<IBook>=>{
    const res = await fetch(clientAPIRoutes.updateBook(bookId), { method: "PATCH", body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to update the book');
    return await res.json();
}

type RemoveBookMutation = {bookId:number}
const removeBook = async ({bookId}:RemoveBookMutation) : Promise<void>=>{
    await fetch(clientAPIRoutes.deleteBook(bookId), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    location.reload()
}

type CreateBookMutation = {bookData:IBookPayload}
export const createBook = async ({bookData}:CreateBookMutation): Promise<IBook> => {
    const bookPayload: Payload<IBookPayload> = {
      data: bookData,
      entityType: 'book',
    };
  
    const res = await fetch(clientAPIRoutes.createBook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookPayload),
    });
  
    if (!res.ok) throw new Error('Failed to create book');
    return await res.json();
  };

export {updateBook,fetchChapter,removeBook}