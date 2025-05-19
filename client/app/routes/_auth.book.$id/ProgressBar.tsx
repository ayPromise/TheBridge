import React, { useEffect, useState } from 'react'

type ProgressBarProps = {
    onFinish: () => void
}

const ProgressBar: React.FC<ProgressBarProps> = ({ onFinish }) => {
    const [scrollProgress, setScrollProgress] = useState<number>(0);

    useEffect(() => {
        const target = window;

        const updateScrollProgress = () => {
            const scrollTop = target.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = target.innerHeight;

            const totalScrollable = scrollHeight - clientHeight;
            const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;

            if (totalScrollable <= 0 || progress >= 99.5) {
                onFinish()
            }
            setScrollProgress(progress);
        };

        target.addEventListener('scroll', updateScrollProgress);
        target.addEventListener('resize', updateScrollProgress);
        updateScrollProgress();

        return () => {
            target.removeEventListener('scroll', updateScrollProgress);
            target.removeEventListener('resize', updateScrollProgress);
        };
    }, []);

    return (
        <div className={`sticky top-0 left-0 transition-all bg-main-extraLight h-[7px] ease-out z-100 
            ${scrollProgress >= 99.5 ? 'blink' : ''
            }`}
            style={{
                width: `${scrollProgress}%`
            }}></div>
    );
}

export default ProgressBar