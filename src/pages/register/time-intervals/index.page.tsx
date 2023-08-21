import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '../../../utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from '../../../utils/convert-time-string-to-minutes'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa adicionar pelo menos um dia da semana!',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'Horário de término deve ser pelo menos 1 hora distante do ínicio',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    mode: 'onBlur',
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields: intervals } = useFieldArray({
    control,
    name: 'intervals',
  })

  const handleSetTimeIntervals = async (data: TimeIntervalsFormOutput) => {
    await api.post('/users/time-intervals', {
      intervals: data.intervals,
    })

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />

      <S.Container>
        <S.Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </S.Header>

        <S.Content as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <S.IntervalsContainer>
            {intervals.map(({ weekDay, id }, index) => {
              const isChecked = watch(`intervals.${index}.enabled`) === true

              return (
                <S.IntervalItem key={id}>
                  <S.IntervalDay>
                    <Controller
                      control={control}
                      name={`intervals.${index}.enabled`}
                      render={({ field }) => (
                        <Checkbox
                          id={`${weekDay}-check`}
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true)
                          }}
                        />
                      )}
                    />
                    <Text as="label" htmlFor={`${weekDay}-check`}>
                      {weekDays[weekDay]}
                    </Text>
                  </S.IntervalDay>

                  <S.IntervalInputs>
                    <TextInput
                      crossOrigin={null}
                      size="sm"
                      type="time"
                      step={60}
                      disabled={!isChecked}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      crossOrigin={null}
                      size="sm"
                      type="time"
                      step={60}
                      disabled={!isChecked}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </S.IntervalInputs>
                </S.IntervalItem>
              )
            })}
          </S.IntervalsContainer>

          {errors.intervals?.message && (
            <S.FormError>{errors.intervals?.message}</S.FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </S.Content>
      </S.Container>
    </>
  )
}
