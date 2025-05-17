import React from "react";
import type { IChapterParagraph } from "types/Chapter";


const ParagraphContent: React.FC<{ list: IChapterParagraph[] }> = ({ list }) => {
    if (list && typeof list === "string")
        return <p className="mb-4 leading-relaxed text-justify">{list}</p>

    if (Array.isArray(list))
        return list.map((paragraph, index) => {
            if (typeof paragraph === "object") {
                if (paragraph.emphasis) {
                    return <p key={index} className="mb-4 leading-relaxed text-center text-[25px] font-bold">{String(paragraph.emphasis)}</p>
                }

                if (paragraph["#text"]) {
                    return <p key={index} className="mb-4 leading-relaxed text-justify">
                        {paragraph["#text"]}
                    </p>
                }
            }
            return <p key={index} className="mb-4 leading-relaxed text-justify">{String(paragraph)}</p>
        })
};

export default ParagraphContent