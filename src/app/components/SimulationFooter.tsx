import React from "react";

interface SimulationFooterProps {
    leftContent?: React.ReactNode;
    centerContent?: React.ReactNode;
    rightContent?: React.ReactNode;
}

export function SimulationFooter({
    leftContent,
    centerContent,
    rightContent,
}: SimulationFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-md py-3 px-4 flex items-center justify-between h-20">
            <div className="w-1/3 flex items-center">
                {leftContent}
            </div>
            <div className="w-1/3 flex justify-center">
                {centerContent}
            </div>
            <div className="w-1/3 flex justify-end">
                {rightContent}
            </div>
        </div>
    );
}