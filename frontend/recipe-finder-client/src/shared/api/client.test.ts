import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import api, { notifyUnauthorized, resetUnauthorizedLatch, setUnauthorizedHandler } from './client'

describe('unauthorized session handling', () => {
  beforeEach(() => resetUnauthorizedLatch())

  it('notifies the auth layer once for a burst of expired requests', () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)

    notifyUnauthorized()
    notifyUnauthorized()

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('can handle a later expiration after a successful login reset', () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    notifyUnauthorized()
    resetUnauthorizedLatch()
    notifyUnauthorized()

    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('routes a real protected-request 401 through the interceptor once without retrying', async () => {
    const handler = vi.fn()
    const adapter = vi.fn(async (config) => {
      const response: AxiosResponse = {
        data: { message: 'expired' },
        status: 401,
        statusText: 'Unauthorized',
        headers: new AxiosHeaders(),
        config,
      }
      throw new AxiosError('expired', AxiosError.ERR_BAD_REQUEST, config, undefined, response)
    })
    setUnauthorizedHandler(handler)

    await expect(api.get('/recipes', { adapter })).rejects.toBeInstanceOf(AxiosError)

    expect(adapter).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
