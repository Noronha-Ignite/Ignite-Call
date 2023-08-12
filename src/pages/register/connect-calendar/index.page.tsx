import { Avatar, Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  const handleConnectCalendar = async () => {
    await signIn('google')
  }

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
          {isSignedIn ? (
            <S.LoggedButton variant="secondary" size="sm" disabled>
              <Text size="sm">Conectado</Text>
              <Avatar
                css={{ width: '$6', height: '$6' }}
                src={session?.data?.user?.avatar_url}
              />
            </S.LoggedButton>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleConnectCalendar}
            >
              Conectar <ArrowRight />
            </Button>
          )}
        </S.ContentItem>

        {hasAuthError && (
          <S.AuthError>
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </S.AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          Próximo passo <ArrowRight />
        </Button>
      </S.Content>
    </S.Container>
  )
}
