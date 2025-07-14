'use client'

import React, { Component, ErrorInfo, ReactNode, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Mail, 
  Bug,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  level?: 'page' | 'section' | 'component'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Report to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      })
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state
    const maxRetries = 3
    
    if (retryCount >= maxRetries) {
      return
    }

    this.setState({ retryCount: retryCount + 1 })

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }

    // Add delay for progressive retry
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000)
    
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false
      })
    }, delay)
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state
    const { children, fallback, level = 'component' } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <ErrorDisplay
          error={error}
          errorInfo={errorInfo}
          showDetails={showDetails}
          retryCount={retryCount}
          level={level}
          onRetry={this.handleRetry}
          onToggleDetails={this.toggleDetails}
        />
      )
    }

    return children
  }
}

interface ErrorDisplayProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
  retryCount: number
  level: 'page' | 'section' | 'component'
  onRetry: () => void
  onToggleDetails: () => void
}

const ErrorDisplay = memo<ErrorDisplayProps>(({
  error,
  errorInfo,
  showDetails,
  retryCount,
  level,
  onRetry,
  onToggleDetails
}) => {
  const maxRetries = 3
  const canRetry = retryCount < maxRetries

  const getErrorTitle = () => {
    switch (level) {
      case 'page': return 'Ops! Algo deu errado nesta página'
      case 'section': return 'Erro ao carregar esta seção'
      case 'component': return 'Erro no componente'
      default: return 'Algo deu errado'
    }
  }

  const getErrorDescription = () => {
    switch (level) {
      case 'page': return 'Encontramos um problema ao carregar esta página. Tente novamente ou volte ao início.'
      case 'section': return 'Esta seção não pôde ser carregada corretamente. Tente recarregar.'
      case 'component': return 'Este componente apresentou um erro inesperado.'
      default: return 'Ocorreu um erro inesperado. Tente novamente.'
    }
  }

  const cardSize = level === 'page' ? 'py-16' : level === 'section' ? 'py-12' : 'py-8'

  return (
    <Card className={cn(
      "border-red-200 bg-red-50/50",
      level === 'page' && "max-w-2xl mx-auto"
    )}>
      <CardContent className={cn("text-center", cardSize)}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-red-900">
              {getErrorTitle()}
            </h3>
            <p className="text-red-700">
              {getErrorDescription()}
            </p>
            
            {retryCount > 0 && (
              <Badge variant="outline" className="border-red-300 text-red-700">
                Tentativa {retryCount} de {maxRetries}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {canRetry && (
              <Button 
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700"
                disabled={retryCount >= maxRetries}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            )}
            
            {level === 'page' && (
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
            )}
          </div>

          {/* Error Details Toggle */}
          {(error || errorInfo) && (
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDetails}
                className="text-red-700 hover:text-red-800"
              >
                <Bug className="mr-2 h-4 w-4" />
                {showDetails ? 'Ocultar' : 'Ver'} Detalhes Técnicos
                {showDetails ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>

              {showDetails && (
                <Card className="bg-gray-100 border-gray-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-800">Informações Técnicas</CardTitle>
                    <CardDescription className="text-xs">
                      Estas informações podem ajudar nossa equipe a resolver o problema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 text-left">
                      {error && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Erro:</h4>
                          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                            {error.toString()}
                          </pre>
                        </div>
                      )}
                      
                      {errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Stack do Componente:</h4>
                          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Support Contact */}
          <div className="pt-4 border-t border-red-200">
            <p className="text-sm text-red-600 mb-3">
              Se o problema persistir, entre em contato com o suporte:
            </p>
            <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
              <Mail className="mr-2 h-4 w-4" />
              suporte@laviepet.com.br
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ErrorDisplay.displayName = 'ErrorDisplay'

// Specialized error boundaries for different use cases
export const PageErrorBoundary = memo<{
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}>(({ children, onError }) => (
  <ErrorBoundary level="page" onError={onError}>
    {children}
  </ErrorBoundary>
))

PageErrorBoundary.displayName = 'PageErrorBoundary'

export const SectionErrorBoundary = memo<{
  children: ReactNode
  fallback?: ReactNode
}>(({ children, fallback }) => (
  <ErrorBoundary level="section" fallback={fallback}>
    {children}
  </ErrorBoundary>
))

SectionErrorBoundary.displayName = 'SectionErrorBoundary'

export const ComponentErrorBoundary = memo<{
  children: ReactNode
  fallback?: ReactNode
}>(({ children, fallback }) => (
  <ErrorBoundary level="component" fallback={fallback}>
    {children}
  </ErrorBoundary>
))

ComponentErrorBoundary.displayName = 'ComponentErrorBoundary'

// Simple error state component for use without error boundaries
export const ErrorState = memo<{
  title?: string
  description?: string
  onRetry?: () => void
  showSupport?: boolean
  className?: string
}>(({ 
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Tente novamente.",
  onRetry,
  showSupport = true,
  className 
}) => (
  <Card className={cn("border-red-200 bg-red-50/50", className)}>
    <CardContent className="text-center py-8">
      <div className="max-w-sm mx-auto space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-red-900">{title}</h3>
          <p className="text-sm text-red-700">{description}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          {onRetry && (
            <Button size="sm" onClick={onRetry} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          )}
          
          {showSupport && (
            <Button variant="outline" size="sm" className="border-red-300 text-red-700">
              <Mail className="mr-2 h-4 w-4" />
              Contatar Suporte
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
))

ErrorState.displayName = 'ErrorState'

export default ErrorBoundary