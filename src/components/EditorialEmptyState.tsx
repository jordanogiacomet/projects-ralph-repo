import { Button, Card, SectionHeading } from '@/components/ui'
import { cn } from '@/lib/utils'

type EditorialEmptyStateAction = {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success'
}

type EditorialEmptyStateProps = {
  align?: 'left' | 'center'
  className?: string
  description: string
  eyebrow?: string
  primaryAction?: EditorialEmptyStateAction
  secondaryAction?: EditorialEmptyStateAction
  title: string
}

function renderAction(action: EditorialEmptyStateAction | undefined, key: string) {
  if (!action) return null

  const commonProps = {
    className: 'rounded-pill',
    size: 'lg' as const,
    variant: action.variant ?? 'primary',
  }

  if (action.href) {
    return (
      <Button key={key} href={action.href} {...commonProps}>
        {action.label}
      </Button>
    )
  }

  return (
    <Button key={key} type="button" onClick={action.onClick} {...commonProps}>
      {action.label}
    </Button>
  )
}

export function EditorialEmptyState({
  align = 'left',
  className,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  title,
}: EditorialEmptyStateProps) {
  return (
    <Card
      as="article"
      className={cn(
        'relative overflow-hidden border-border/90 bg-white/95 p-8 shadow-soft sm:p-10',
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.04) 100%)',
        }}
        aria-hidden
      />
      <div className={cn('relative', align === 'center' && 'text-center')}>
        <SectionHeading
          align={align}
          eyebrow={eyebrow}
          title={title}
          description={description}
          size="sm"
        />

        {primaryAction || secondaryAction ? (
          <div
            className={cn(
              'mt-6 flex flex-col gap-3 sm:flex-row',
              align === 'center' && 'justify-center',
            )}
          >
            {renderAction(primaryAction, 'primary-action')}
            {renderAction(secondaryAction, 'secondary-action')}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
