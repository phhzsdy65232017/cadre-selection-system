"use client"

import { SelectionStage, STAGES, getStageProgress } from "@/lib/supabase"
import { Check, Circle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface StageStepperProps {
  currentStage: SelectionStage
  onStageClick?: (stage: SelectionStage) => void
}

export function StageStepper({ currentStage, onStageClick }: StageStepperProps) {
  const { current, total, percentage } = getStageProgress(currentStage)
  const currentOrder = STAGES.find(s => s.key === currentStage)?.order || 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">当前进度</span>
        <span className="text-sm text-muted-foreground">{current}/{total} 环节</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {STAGES.filter(s => s.key !== 'completed').map((stage) => {
          const isCompleted = stage.order < currentOrder
          const isCurrent = stage.key === currentStage
          const isLocked = stage.order > currentOrder

          return (
            <button
              key={stage.key}
              onClick={() => !isLocked && onStageClick?.(stage.key)}
              disabled={isLocked}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left",
                isCurrent && "bg-primary/10 border border-primary/20",
                isCompleted && "hover:bg-gray-100",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                isCompleted && "bg-green-500 text-white",
                isCurrent && "bg-primary text-white",
                isLocked && "bg-gray-200 text-gray-400"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Circle className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  isCurrent && "text-primary"
                )}>
                  {stage.order}. {stage.label}
                </p>
              </div>
              {isCurrent && (
                <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                  当前
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
