<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

import { login } from '../../api/authService'

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
    name: 'remember',
    type: 'checkbox',
    label: 'Remember me'
  }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const p = payload as unknown
  let form: Record<string, unknown> = {}
  if (typeof p === 'object' && p !== null && 'data' in (p as Record<string, unknown>)) {
    form = (p as { data: Record<string, unknown> }).data
  } else if (typeof p === 'object' && p !== null) {
    form = p as Record<string, unknown>
  }

  try {
    await login({
      email: typeof form.email === 'string' ? form.email : undefined,
      password: typeof form.password === 'string' ? form.password : undefined
    })
    toast.add({ title: 'Login successful', description: 'You are now logged in.' })
    // TODO: handle token/session (store in pinia/cookie) and redirect if needed
    console.log('Login success', form.email)
  } catch (errUnknown) {
    const errObj = errUnknown as { body?: { message?: string }, message?: string }
    const message = errObj.body?.message ?? errObj.message ?? 'Login failed'
    toast.add({ title: 'Login failed', description: String(message) })
    console.error('Login error', errUnknown)
  }
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Login"
      description="Enter your credentials to access your account."
      icon="i-lucide-user"
      :fields="fields"
      @submit="onSubmit"
    />
  </UPageCard>
</template>
