import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '../../lib/axios'
import { AxiosError } from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Informe um usuário com pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Usuário deve conter apenas letras e hifens.',
    })
    .toLowerCase(),

  name: z
    .string()
    .min(3, { message: 'Informe um nome com pelo menos 3 letras.' })
    .regex(/^([a-z ]+)$/i, {
      message: 'Nome deve conter apenas letras.',
    }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
  })

  const router = useRouter()
  const { username } = router.query

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await api.post('users', {
        name: data.name,
        username: data.username,
      })
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data.message) {
        return alert(err.response.data.message)
      }

      console.log(err)
    }
  }

  useEffect(() => {
    if (username) {
      setValue('username', String(username))
    }
  }, [username, setValue])

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </S.Header>

      <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            crossOrigin={null}
            prefix="ignitecall.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />

          {errors.username && (
            <S.FormError size="sm">{errors.username.message}</S.FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput
            crossOrigin={null}
            placeholder="Seu nome"
            {...register('name')}
          />

          {errors.name && (
            <S.FormError size="sm">{errors.name.message}</S.FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo <ArrowRight />
        </Button>
      </S.Form>
    </S.Container>
  )
}
