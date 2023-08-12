import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'

export default function Register() {
  // const handleRegister = async (data: RegisterFormData) => {}

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </S.Header>

      <S.Content>
        <S.ContentItem>
          <Text>Google Calendar</Text>
          <Button size="sm" variant="secondary">
            Conectar <ArrowRight />
          </Button>
        </S.ContentItem>

        <Button type="submit">
          Próximo passo <ArrowRight />
        </Button>
      </S.Content>
    </S.Container>
  )
}
