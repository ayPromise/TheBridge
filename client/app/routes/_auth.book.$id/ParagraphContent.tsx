import React from "react";


const ParagraphContent: React.FC<{ list: string[] | string }> = ({ list }) => {
    if (list && typeof list === "string")
        return <p className="mb-4 leading-relaxed text-justify">{list}</p>

    if (list && typeof list === "object")
        return list.map((paragraph: string | { a: any, "#text": string }, index) => {
            let text = paragraph
            if (paragraph["#text"])
                text = paragraph["#text"]
            return <p key={index} className="mb-4 leading-relaxed text-justify">{String(text)}</p>
        })
};

export default ParagraphContent