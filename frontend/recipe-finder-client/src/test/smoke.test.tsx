import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppLoader } from '../shared/ui/AppLoader'

describe('AppLoader', () => {
  it('announces application bootstrap to assistive technology', () => {
    render(<AppLoader />)

    expect(
      screen.getByRole('status', { name: /recipe finder yüklənir/i }),
    ).toBeInTheDocument()
  })
})
