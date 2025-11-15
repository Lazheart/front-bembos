<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

declare function useAuth(): { login: (p: Record<string, unknown>) => Promise<unknown>, greeting: string | null }

const DEFAULT_TENANT = 'TENANT#BEMBOS'

const { login, greeting } = useAuth()

const fields: AuthFormField[] = [
  {
    name: 'identifier',
    type: 'text',
    label: 'Email or Username',
    placeholder: 'Enter your email or username',
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
  identifier: z.string().min(1, 'Required'),
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

  // Ensure tenantId is always present in the outgoing payload
  form.tenantId = typeof form.tenantId === 'string' ? form.tenantId : DEFAULT_TENANT

  try {
    const identifier = typeof form.identifier === 'string' ? form.identifier : undefined
    const res = await login({
      tenantId: typeof form.tenantId === 'string' ? form.tenantId : DEFAULT_TENANT,
      email: identifier,
      password: typeof form.password === 'string' ? form.password : undefined
    })

    // if login succeeded navigate
    if (res) {
      navigateTo('/')
    }
    console.log('Login success', identifier)
  } catch (errUnknown) {
    console.error('Login error', errUnknown)
  }
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <!-- Greeting when user is present -->
    <UAlert
      v-if="greeting"
      :title="greeting"
      color="primary"
      class="mb-4"
    />

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
