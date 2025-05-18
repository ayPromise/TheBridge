import { clientAPIRoutes } from "consts/endpoints";
import type {IChaptersPayload, Payload } from "types/Payloads";

type CreateChaptersMutation = {chapterData:IChaptersPayload}
const createChapter = async (
  {chapterData}:CreateChaptersMutation
): Promise<void> => {

  const chapterPayload: Payload<IChaptersPayload> = {
    data: chapterData,
    entityType: 'chapter',
  };

  const res = await fetch(clientAPIRoutes.createChapters, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chapterPayload),
  });

  if (!res.ok) throw new Error('Failed to create chapter');
};

export {createChapter}