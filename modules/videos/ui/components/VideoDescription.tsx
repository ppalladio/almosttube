import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

interface VideoDescriptionProps {
    compactView: string;
    expandedView: string;
    compactDate: string;
    expandedDate: string;
    description?: string|null;
}
const VideoDescription = ({ compactView, expandedView, compactDate, expandedDate, description }: VideoDescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div
            onClick={() => setIsExpanded((current) => !current)}
            className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition"
        >
            <div className="flex-gap-2 text-sm mb-2">
                <span className="font-medium">{isExpanded ? expandedView : compactView} views {" "}</span>
                <span className="font-medium">{isExpanded ? expandedDate : compactDate}</span>
                <div className="relative">
                    <p className={cn('text-sm whitespace-pre-wrap', !isExpanded && 'line-clamp-2')}>{description ?? 'No description'}</p>
                    <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                        {isExpanded ? (
                            <>
                                Show less <ChevronUpIcon className="size-4" />
                            </>
                        ) : (
                            <>
                                Show more <ChevronDownIcon className="size-4" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VideoDescription;
