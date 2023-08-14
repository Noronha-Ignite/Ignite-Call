import { capitalize } from './text'

type GetWeekDaysParams = {
  short?: boolean
}

export const getWeekDays = ({ short = false }: GetWeekDaysParams = {}) => {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.toUpperCase().substring(0, 3)
      }

      return capitalize(weekDay)
    })
}
