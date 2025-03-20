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
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex items-center justify-between">
            <div className="w-1/3">
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
