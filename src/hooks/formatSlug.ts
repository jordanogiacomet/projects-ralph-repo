import type { FieldHook } from 'payload'

export const formatSlug = (val: string): string =>
  val
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const formatSlugHook: FieldHook = ({ data, operation, value }) => {
  if (operation === 'create' || operation === 'update') {
    if (typeof value === 'string' && value.length > 0) {
      return formatSlug(value)
    }
    if (data?.title && typeof data.title === 'string') {
      return formatSlug(data.title)
    }
  }
  return value
}
