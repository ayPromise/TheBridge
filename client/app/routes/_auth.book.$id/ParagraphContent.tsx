import React from "react";
import type { IChapterParagraph } from "types/Chapter";

type ParagraphContentProps = { list: IChapterParagraph[], paragraphClassNames?: string }

const ParagraphContent: React.FC<ParagraphContentProps> = ({ list, paragraphClassNames }) => {
    const customStyles = paragraphClassNames ?? ""

    if (list && typeof list === "string")
        return <p className={`mb-4 leading-relaxed text-justify ${customStyles}`}>{list}</p>

    if (Array.isArray(list))
        return list.map((paragraph, index) => {
            if (typeof paragraph === "object") {
                if (paragraph.emphasis) {
                    return <p key={index} className={`mb-4 leading-relaxed text-center text-[25px] font-bold ${customStyles}`}>{String(paragraph.emphasis)}</p>
                }

                if (paragraph["#text"]) {
                    return <p key={index} className={`mb-4 leading-relaxed text-justify ${customStyles}`}>
                        {paragraph["#text"]}
                    </p>
                }
            }
            return <p key={index} className={`mb-4 leading-relaxed text-justify ${customStyles}`}>{String(paragraph)}</p>
        })
};

export default ParagraphContent