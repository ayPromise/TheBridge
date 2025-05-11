import React from 'react'

// types
import type { IEpigraph } from 'types/Chapter';

// components
import ParagraphContent from './ParagraphContent';

// interfaces
interface EpigraphProps {
    epigraphData: IEpigraph | undefined;
}

const Epigraph: React.FC<EpigraphProps> = ({ epigraphData }) => {
    return epigraphData && <div className='flex flex-col items-end'>
        <h3>{epigraphData.author}</h3>
        {epigraphData.rawContent.map((block, index) => <ParagraphContent block={block} key={index} />)}
    </div>
}

export default Epigraph