import { clientAPIRoutes } from "consts/endpoints";
import type { INotesPayload, Payload } from "types/Payloads";

type CreateNotesMutation = {notesData:INotesPayload}
const createNotes = async (
    {notesData}:CreateNotesMutation
  ): Promise<void> => {
    const notesPayload: Payload<INotesPayload> = {
      data: notesData,
      entityType: 'notes',
    };
  
    const res = await fetch(clientAPIRoutes.createNotes, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notesPayload),
    });


    if(!res.ok) throw new Error("Failed while creating notes")
  
  };

export {createNotes}