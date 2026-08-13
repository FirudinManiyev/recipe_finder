import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppErrorBoundary } from './AppErrorBoundary'

function BrokenComponent(): never {
  throw new Error('render failed')
}

describe('AppErrorBoundary', () => {
  it('contains a render failure and offers recovery actions', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(
      <>
        <p>Naviqasiya işləyir</p>
        <AppErrorBoundary>
          <BrokenComponent />
        </AppErrorBoundary>
      </>,
    )

    expect(screen.getByText('Naviqasiya işləyir')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /nəsə düzgün işləmədi/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /yenidən yüklə/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ana səhifə/i })).toHaveAttribute('href', '/')
  })
})
