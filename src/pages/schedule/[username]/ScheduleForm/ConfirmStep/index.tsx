import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'

export const ConfirmStep = () => {
  const handleConfirmScheduling = () => {
    return null
  }

  return (
    <S.ConfirmForm as="form" onSubmit={handleConfirmScheduling}>
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
        <TextInput placeholder="Seu nome" crossOrigin={null} />
      </label>
      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          crossOrigin={null}
        />
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea />
      </label>

      <S.FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit">Enviar</Button>
      </S.FormActions>
    </S.ConfirmForm>
  )
}
