import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import * as S from './styles'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Informe um usuário com pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Usuário deve conter apenas letras e hifens.',
    })
    .toLowerCase(),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export const ClaimUsernameForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
    mode: 'onBlur',
  })

  const router = useRouter()

  const handleClaimUsername = async (data: ClaimUsernameFormData) => {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <S.Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          crossOrigin={null}
          size="sm"
          prefix="ignitecall.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />

        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </S.Form>

      <S.FormAnnotation error={!!errors.username}>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário'}
        </Text>
      </S.FormAnnotation>
    </>
  )
}
