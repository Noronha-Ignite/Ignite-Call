import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs, { Dayjs } from 'dayjs'

import * as S from './styles'
import { getWeekDays } from '../../utils/get-week-days'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { useRouter } from 'next/router'

type CalendarDay = {
  date: Dayjs
  disabled: boolean
}

type CalendarWeek = CalendarDay[]

type CalendarProps = {
  selectedDate?: Date
  onDateSelected(date: Date): void
}

type BlockedDates = {
  blockedWeekDays: number[]
  blockedDates: number[]
}

type BuildCalendarOptions = {
  weekDaysNotAllowed: number[]
  datesAlreadyFull: number[]
}

const fetchBlockedDays = async (username: string, currentDate: Dayjs) => {
  const response = await api.get<BlockedDates>(
    `/users/${username}/blocked-dates`,
    {
      params: {
        year: currentDate.get('year'),
        month: String(currentDate.get('month') + 1).padStart(2, '0'),
      },
    },
  )

  const { blockedDates, blockedWeekDays } = response.data

  return {
    weekDaysNotAllowed: blockedWeekDays,
    datesAlreadyFull: blockedDates,
  }
}

const splitMonthDaysInWeeks = (days: CalendarDay[]): CalendarWeek[] =>
  days.reduce<CalendarWeek[]>((weeksAcc, day, index) => {
    const weekIndex = Math.floor(index / 7)

    const isNewWeek = !weeksAcc[weekIndex]

    if (isNewWeek) {
      weeksAcc[weekIndex] = [day]
    } else {
      const weekToInsert = weeksAcc[weekIndex]

      weekToInsert.push(day)
    }

    return weeksAcc
  }, [])

const buildCalendarWeeks = (
  currentDate: Dayjs,
  { datesAlreadyFull, weekDaysNotAllowed }: BuildCalendarOptions,
) => {
  const daysInMonthArray = Array.from({
    length: currentDate.daysInMonth(),
  }).map((_, index) => currentDate.set('date', index + 1))

  const firstWeekDay = currentDate.get('day')
  const lastWeekDay = currentDate
    .set('date', currentDate.daysInMonth())
    .get('day')

  const previousMonthFillArray = Array.from({
    length: firstWeekDay,
  })
    .map((_, i) => currentDate.subtract(i + 1, 'day'))
    .reverse()

  const nextMonthFillArray = Array.from({
    length: 7 - (lastWeekDay + 1),
  }).map((_, i) => currentDate.add(1, 'month').add(i, 'day'))

  const completeCalendarDays = [
    ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
    ...daysInMonthArray.map((date) => ({
      date,
      disabled:
        date.endOf('day').isBefore(new Date()) ||
        weekDaysNotAllowed.includes(date.get('day')) ||
        datesAlreadyFull.includes(date.get('date')),
    })),
    ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
  ]

  const weeks = splitMonthDaysInWeeks(completeCalendarDays)

  return weeks
}

export const Calendar = ({ onDateSelected }: CalendarProps) => {
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }
  const handleNextMonth = () => {
    const previousMonthDate = currentDate.add(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const username = String(router.query.username)

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const { data: blockedDates } = useQuery(
    ['blockedWeekDays', username, currentDate],
    () => fetchBlockedDays(username, currentDate),
    {
      initialData: {
        weekDaysNotAllowed: [0, 1, 2, 3, 4, 5, 6],
        datesAlreadyFull: [],
      },
    },
  )

  const calendarWeeks = useMemo(
    () =>
      buildCalendarWeeks(currentDate, {
        datesAlreadyFull: blockedDates.datesAlreadyFull,
        weekDaysNotAllowed: blockedDates.weekDaysNotAllowed,
      }),
    [currentDate, blockedDates],
  )

  return (
    <S.CalendarContainer>
      <S.CalendarHeader>
        <S.CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </S.CalendarTitle>

        <S.CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </S.CalendarActions>
      </S.CalendarHeader>

      <S.CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map((week) => (
            <tr key={week[0].date.toString()}>
              {week.map(({ date: dayInWeek, disabled }) => (
                <td key={dayInWeek.toString()}>
                  <S.CalendarDay
                    disabled={disabled}
                    onClick={() => onDateSelected(dayInWeek.toDate())}
                  >
                    {dayInWeek.date()}
                  </S.CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.CalendarBody>
    </S.CalendarContainer>
  )
}
