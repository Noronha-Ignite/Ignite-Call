import { Avatar, Box, Button, Heading, Text, styled } from '@ignite-ui/react'

export const Container = styled('main', {
  maxWidth: 572,
  margin: '$20 auto $4',
  padding: '0 $4',
})

export const Header = styled('div', {
  padding: '0 $6',

  [`> ${Heading}`]: {
    lineHeight: '$base',
  },

  [`> ${Text}`]: {
    color: '$gray200',
    marginBottom: '$6',
  },
})

export const Content = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
})

export const ContentItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  border: '1px solid $gray600',
  borderRadius: '$md',
  padding: '$4 $6',

  marginBottom: '$4',
})

export const AuthError = styled(Text, {
  color: '#f75a68',
  marginBottom: '$2',
})

export const LoggedButton = styled(Button, {
  span: {
    height: 'calc(100% - 2px)',
    width: 'auto',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
