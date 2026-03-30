"use client"

import * as React from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  mode?: 'day' | 'month' | 'year'
  format?: string
}

export function DatePicker({ date, setDate, placeholder = "选择日期", disabled, mode = 'day', format: formatString }: DatePickerProps) {
  const [view, setView] = React.useState<'day' | 'month' | 'year'>(mode)
  const [selectedYear, setSelectedYear] = React.useState(date ? date.getFullYear() : new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(date ? date.getMonth() : new Date().getMonth())
  const [currentDisplayYear, setCurrentDisplayYear] = React.useState(date ? date.getFullYear() : new Date().getFullYear())
  const [currentDisplayMonth, setCurrentDisplayMonth] = React.useState(date ? date.getMonth() : new Date().getMonth())

  // 根据模式确定默认格式
  const getDefaultFormat = () => {
    switch (mode) {
      case 'year':
        return 'yyyy年'
      case 'month':
        return 'yyyy年MM月'
      case 'day':
      default:
        return 'yyyy-MM-dd'
    }
  }

  // 确定最终的格式
  const finalFormat = formatString || getDefaultFormat()

  // 处理年份选择
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setCurrentDisplayYear(year) // 更新日历视图年份
    if (mode === 'year') {
      const newDate = new Date(year, 0, 1)
      setDate(newDate)
    } else {
      setView('month')
    }
  }

  // 处理月份选择
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    setCurrentDisplayMonth(month) // 更新日历视图月份
    if (mode === 'month') {
      const newDate = new Date(selectedYear, month, 1)
      setDate(newDate)
    } else {
      setView('day')
    }
  }

  // 渲染年份选择视图
  const renderYearView = () => {
    const startYear = selectedYear - 5
    const endYear = selectedYear + 5
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedYear(selectedYear - 10)}
          >
            上十年
          </Button>
          <h3 className="text-lg font-medium">选择年份</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedYear(selectedYear + 10)}
          >
            下十年
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={year === selectedYear ? "default" : "outline"}
              onClick={() => handleYearSelect(year)}
              className="h-10"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // 渲染月份选择视图
  const renderMonthView = () => {
    const months = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ]

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setView('year')}
          >
            返回年份
          </Button>
          <h3 className="text-lg font-medium">{selectedYear}年</h3>
          <div className="w-8"></div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {months.map((month, index) => (
            <Button
              key={index}
              variant={index === selectedMonth ? "default" : "outline"}
              onClick={() => handleMonthSelect(index)}
              className="h-10"
            >
              {month}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // 渲染日历视图（带年份和月份快速选择）
  const renderCalendarView = () => {
    return (
      <div>
        {/* 年份和月份快速选择器 */}
        <div className="flex items-center justify-between p-3 border-b">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const newYear = currentDisplayYear - 1
              setCurrentDisplayYear(newYear)
              setCurrentDisplayMonth(0) // 重置到1月
            }}
          >
            上一年
          </Button>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setView('year')}
              className="text-sm"
            >
              {currentDisplayYear}年
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setView('month')}
              className="text-sm"
            >
              {currentDisplayMonth + 1}月
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const newYear = currentDisplayYear + 1
              setCurrentDisplayYear(newYear)
              setCurrentDisplayMonth(0) // 重置到1月
            }}
          >
            下一年
          </Button>
        </div>
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onDayClick={(selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate)
              }
            }}
            month={new Date(currentDisplayYear, currentDisplayMonth)}
          />
        </div>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, finalFormat, { locale: zhCN }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {mode === 'year' ? (
          renderYearView()
        ) : mode === 'month' ? (
          renderMonthView()
        ) : (
          <>
            {view === 'year' ? (
              renderYearView()
            ) : view === 'month' ? (
              renderMonthView()
            ) : (
              renderCalendarView()
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
