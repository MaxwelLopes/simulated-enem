import { useState, useEffect } from "react";

type TimerProps = {
    initialTime?: number;
    className?: string;
};

export function Timer({ initialTime = 0, className }: TimerProps) {
    const [time, setTime] = useState<number>(initialTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;

    const formatNumber = (num: number) => num.toString().padStart(2, "0");

    return (
        <div className={`inline-flex items-center space-x-1 rounded-xl bg-gray-100 px-3 py-1 text-lg font-medium tracking-wide text-slate-700 dark:bg-gray-800 dark:text-slate-300 shadow-md ${className || ""}`}>
            {days > 0 && (
                <>
                    <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">{days}</span>
                    <span className="mx-1 text-slate-500 text-sm">d</span>
                </>
            )}
            <span className="tabular-nums bg-white dark:bg-gray-700 px-2 py-1 rounded-lg shadow-sm">{formatNumber(hours)}</span>
            <span className="text-slate-500">:</span>
            <span className="tabular-nums bg-white dark:bg-gray-700 px-2 py-1 rounded-lg shadow-sm">{formatNumber(minutes)}</span>
            <span className="text-slate-500">:</span>
            <span className="tabular-nums bg-white dark:bg-gray-700 px-2 py-1 rounded-lg shadow-sm">{formatNumber(seconds)}</span>
        </div>
    );
}
