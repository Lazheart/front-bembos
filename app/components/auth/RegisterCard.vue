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
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Choose a username',
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
  username: z.string().min(1, 'Username required'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

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
  const role = 'USER'

  toast.add({ title: 'Register', description: 'Creating account...' })

  try {
    const payloadToSend: Record<string, unknown> = {
      tenantId: DEFAULT_TENANT,
      email,
      username,
      password,
      role
    }
    await register(payloadToSend)
    toast.add({ title: 'Account created', description: 'Registration successful.' })
    console.log('Register success')
    return
  } catch (errUnknown) {
    const errObj = errUnknown as unknown
    let message = 'Registration failed'
    if (typeof errObj === 'object' && errObj !== null) {
      const asRec = errObj as Record<string, unknown>
      if ('body' in asRec && asRec.body && typeof (asRec.body as Record<string, unknown>).message === 'string') {
        message = String((asRec.body as Record<string, unknown>).message)
      } else if ('message' in asRec && typeof asRec.message === 'string') {
        message = asRec.message as string
      }
    }
    toast.add({ title: 'Registration failed', description: String(message) })
    console.error('Register error', errUnknown)
    throw errUnknown
  }
}
</script>

<template>
  <UPageCard class="w-full max-w-md card auth-card">
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
