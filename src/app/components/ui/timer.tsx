"use client"

import { useState, useEffect } from "react"
import { TimerIcon } from "lucide-react"
import { cn } from "@/lib/utils"



type TimerProps = {
  initialTime?: number
  className?: string
  stop?: boolean
}

export function Timer({ initialTime = 0, className, stop }: TimerProps) {
  const [time, setTime] = useState<number>(0)

  useEffect(() => {
    setTime(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (stop) return;

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [stop])

  const days = Math.floor(time / (24 * 60 * 60))
  const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((time % (60 * 60)) / 60)
  const seconds = time % 60

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-950 mb-4",
        className,
      )}
    >
      <div className="flex items-center space-x-2 mb-2">
        <TimerIcon className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tempo</span>
      </div>

      <div className="flex items-center justify-center space-x-1">
        {days > 0 && (
          <div className="flex items-center mr-1">
            <span className="tabular-nums font-semibold text-sm text-slate-900 dark:text-slate-100">{days}</span>
            <span className="ml-0.5 text-slate-500 text-xs">d</span>
          </div>
        )}
        <span className="tabular-nums bg-slate-50 dark:bg-gray-800 px-2 py-1 rounded text-sm text-slate-900 dark:text-slate-100">
          {formatNumber(hours)}
        </span>
        <span className="text-slate-500 font-medium text-sm">:</span>
        <span className="tabular-nums bg-slate-50 dark:bg-gray-800 px-2 py-1 rounded text-sm text-slate-900 dark:text-slate-100">
          {formatNumber(minutes)}
        </span>
        <span className="text-slate-500 font-medium text-sm">:</span>
        <span className="tabular-nums bg-slate-50 dark:bg-gray-800 px-2 py-1 rounded text-sm text-slate-900 dark:text-slate-100">
          {formatNumber(seconds)}
        </span>
      </div>
    </div>
  )
}
