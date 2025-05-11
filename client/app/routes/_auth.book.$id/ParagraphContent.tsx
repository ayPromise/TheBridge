import React, { useEffect, useRef } from "react";

// types
import type { IParagraphBlock } from "types/Chapter";

const ParagraphContent: React.FC<{ block: IParagraphBlock }> = ({ block }) => {

    //! I don't know why there is only one child in paragraph
    let onlyChild = block.children[0]
    const paragraphRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
        if (paragraphRef.current) {
            const newValue = onlyChild.text.replace(/\[[^\]]*\]/g, "") // removing [1], [2], ... anchors
            paragraphRef.current.innerHTML = newValue;
        }
    }, [onlyChild.text]);

    return (
        <p className="mb-4 leading-relaxed text-justify" ref={paragraphRef}></p>
    );
};

export default ParagraphContent