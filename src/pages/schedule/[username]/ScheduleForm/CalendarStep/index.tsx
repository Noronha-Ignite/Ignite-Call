import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import * as S from './styles'
import dayjs from 'dayjs'
import { api } from '../../../../../lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

type Availability = {
  possibleTimes: number[]
  availableTimes: number[]
}

type CalendarStepProps = {
  onSelectDateTime: (date: Date) => void
}

const fetchAvailability = async (
  username: string,
  selectedDate: string | null,
) => {
  const response = await api.get(`/users/${username}/availability`, {
    params: {
      date: dayjs(selectedDate).format('YYYY-MM-DD'),
    },
  })

  return response.data
}

export const CalendarStep = ({ onSelectDateTime }: CalendarStepProps) => {
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date>()

  const username = String(router.query.username)
  const isSomeDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const monthDay = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>(
    ['availability', username, selectedDateWithoutTime],
    () => fetchAvailability(username, selectedDateWithoutTime),
    {
      enabled: !!selectedDate,
    },
  )

  const handleSelectTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <S.Container isTimePickerOpen={isSomeDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isSomeDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            {weekDay}, <span>{monthDay}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <S.TimePickerItem
                key={hour}
                onClick={() => handleSelectTime(hour)}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </S.TimePickerItem>
            ))}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  )
}
