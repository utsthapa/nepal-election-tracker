import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

const calloutStyles = {
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    icon: Info,
    iconColor: 'text-blue-700',
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    icon: AlertTriangle,
    iconColor: 'text-yellow-800',
  },
  success: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-700',
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    icon: AlertCircle,
    iconColor: 'text-red-700',
  },
}

export function Callout({ type = 'info', title, children }) {
  const style = calloutStyles[type] || calloutStyles.info
  const Icon = style.icon

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold ${style.iconColor} mb-1`}>{title}</h4>
          )}
          <div className="text-sm text-gray-900">{children}</div>
        </div>
      </div>
    </div>
  )
}
