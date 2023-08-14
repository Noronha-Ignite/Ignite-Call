import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve conter ao menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

export const ConfirmStep = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
    mode: 'onBlur',
  })

  const handleConfirmScheduling = async (data: ConfirmFormData) => {
    console.log(data)
  }

  return (
    <S.ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          10 de Agosto de 2023
        </Text>
        <Text>
          <Clock />
          10:00h
        </Text>
      </S.FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          crossOrigin={null}
          {...register('name')}
        />
        {errors.name && (
          <S.FormError size="sm">{errors?.name.message}</S.FormError>
        )}
      </label>
      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          crossOrigin={null}
          {...register('email')}
        />
        {errors.email && (
          <S.FormError size="sm">{errors?.email.message}</S.FormError>
        )}
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <S.FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Enviar
        </Button>
      </S.FormActions>
    </S.ConfirmForm>
  )
}
