import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isLoggedIn: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

export const anyone: Access = () => true
