<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

import { register } from '../../api/authService'

const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm password',
    placeholder: 'Confirm your password',
    required: true
  },
  {
    name: 'remember',
    type: 'checkbox',
    label: 'Remember me'
  }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

function generateUserId() {
  // Prefer secure uuid if available in the browser
  const g = globalThis as unknown as { crypto?: Crypto & { randomUUID?: () => string } }
  const c = g.crypto
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID()
  }
  // Fallback: timestamp + random
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// Assumption: the DynamoDB table expects a tenantId field. The user requested tenant value
// 'TENANT#BEMBOS' prefilled. If your backend expects a different key (e.g. 'tentatId')
// adjust accordingly.
const DEFAULT_TENANT = 'TENANT#BEMBOS'

const onSubmit = async (payload?: FormSubmitEvent<Schema>): Promise<void> => {
  const p = payload as unknown
  let form: Record<string, unknown> = {}
  if (typeof p === 'object' && p !== null && 'data' in (p as Record<string, unknown>)) {
    form = (p as { data: Record<string, unknown> }).data
  } else if (typeof p === 'object' && p !== null) {
    form = p as Record<string, unknown>
  }

  const email = typeof form.email === 'string' ? form.email : ''
  const password = typeof form.password === 'string' ? form.password : ''
  const username = typeof form.username === 'string' ? form.username : (email.split('@')[0] ?? '')
  const role = 'user'

  toast.add({ title: 'Register', description: 'Creating account...' })

  let lastErr: unknown = null
  const maxAttempts = 5
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const userId = generateUserId()
    const payloadToSend: Record<string, unknown> = {
      tenantId: DEFAULT_TENANT,
      userId,
      email,
      role,
      username,
      password
    }

    try {
      await register(payloadToSend)
      toast.add({ title: 'Account created', description: 'Registration successful.' })
      console.log('Register success')
      // Do not return a value to comply with expected onSubmit signature (Promise<void>)
      return
    } catch (errUnknown) {
      lastErr = errUnknown
      // If backend signals duplicate key / conflict, retry with new id. We try a few times.
      const errObj = errUnknown as unknown
      let status: number | undefined
      let body: unknown
      let msgFromBody: string | undefined
      if (typeof errObj === 'object' && errObj !== null) {
        const asRec = errObj as Record<string, unknown>
        status = typeof asRec.status === 'number' ? asRec.status : undefined
        body = asRec.body
      }
      if (typeof body === 'object' && body !== null && 'message' in (body as Record<string, unknown>)) {
        const b = body as Record<string, unknown>
        if (typeof b.message === 'string') msgFromBody = b.message
      }
      const bodyMessageLower = typeof msgFromBody === 'string' ? msgFromBody.toLowerCase() : ''
      const isConflict = status === 409 || bodyMessageLower.includes('exists') || bodyMessageLower.includes('duplicate')
      if (!isConflict) {
        // Non-retryable error → show it and stop
        const message = msgFromBody ?? (typeof errObj === 'object' && errObj !== null && 'message' in (errObj as Record<string, unknown>) ? String((errObj as Record<string, unknown>).message) : 'Registration failed')
        toast.add({ title: 'Registration failed', description: String(message) })
        console.error('Register error', errUnknown)
        throw errUnknown
      }
      // else conflict — retry loop
      console.warn('UserId collision detected, retrying', { userId, attempt })
    }
  }

  // If we reach here, all retries failed
  const finalErr = lastErr as unknown
  let msg = 'Registration failed after retries'
  if (typeof finalErr === 'object' && finalErr !== null) {
    const fe = finalErr as Record<string, unknown>
    if ('body' in fe && typeof fe.body === 'object' && fe.body !== null && 'message' in (fe.body as Record<string, unknown>)) {
      const b = fe.body as Record<string, unknown>
      if (typeof b.message === 'string') msg = b.message
    } else if ('message' in fe && typeof fe.message === 'string') {
      msg = fe.message
    }
  }
  toast.add({ title: 'Registration failed', description: String(msg) })
  console.error('Register final failure', lastErr)
  throw lastErr
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Create account"
      description="Fill the form to create a new account."
      icon="i-lucide-user-plus"
      :fields="fields"
      @submit="onSubmit"
    />
  </UPageCard>
</template>
