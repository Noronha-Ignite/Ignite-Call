import { Button, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'

export const ClaimUsernameForm = () => {
  return (
    <S.Form as="form">
      <TextInput
        crossOrigin={null}
        size="sm"
        prefix="ignitecall.com/"
        placeholder="seu-usuario"
      />

      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </S.Form>
  )
}
