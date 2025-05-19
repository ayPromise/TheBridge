import { clientAPIRoutes } from "consts/endpoints";
import type { IChapter } from "types/Chapter";
import type {IChaptersPayload, IChapterUpdatePayload, Payload } from "types/Payloads";

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

type UpdateChaptersMutation = {chapterId:number, chapterData:IChapterUpdatePayload}
const updateChapter = async (
  {chapterData,chapterId}:UpdateChaptersMutation
): Promise<IChapter> => {

  const res = await fetch(clientAPIRoutes.updateChapter(chapterId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chapterData),
  });

  if (!res.ok) throw new Error('Failed to create chapter');

  return await res.json()
};

export {createChapter, updateChapter}