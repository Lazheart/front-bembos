<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

import { register } from '../../api/authService'

const toast = useToast()

const rememberMe = ref(false)

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
  <UPageCard class="auth-card w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Create account"
      description="Fill the form to create a new account."
      icon="i-lucide-user-plus"
      :fields="fields"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="remember-toggle-container">
          <label class="remember-toggle">
            <span class="remember-toggle__label">Remember me</span>
            <button
              type="button"
              class="remember-toggle__switch"
              :class="{ 'remember-toggle__switch--active': rememberMe }"
              role="switch"
              :aria-checked="rememberMe"
              @click="rememberMe = !rememberMe"
            >
              <span class="remember-toggle__thumb" />
            </button>
          </label>
        </div>
        <UButton
          type="submit"
          block
          class="auth-submit-btn"
        >
          Create account
        </UButton>
      </template>
    </UAuthForm>
  </UPageCard>
</template>

<style scoped>
.auth-card {
  background: var(--color-surface);
  border: 2px solid var(--color-navbar-border);
  border-radius: 1.5rem;
  box-shadow: var(--color-card-shadow);
  padding: 2rem;
}

.auth-card :deep(.u-auth-form__title),
.auth-card :deep(h2) {
  color: var(--color-tertiary-1);
  font-weight: 700;
}

.auth-card :deep(.u-auth-form__description) {
  color: var(--color-muted);
}

.auth-submit-btn {
  background: linear-gradient(135deg, var(--color-tertiary-1) 0%, var(--color-primary) 100%);
  color: var(--color-cta-text);
  border: none;
  border-radius: 999px;
  font-weight: 700;
  padding: 0.85em 2em;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-tertiary-1) 30%, transparent);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  margin-top: 1rem;
}

.auth-submit-btn:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary-2) 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-tertiary-2) 35%, transparent);
}

.remember-toggle-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}

.remember-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.remember-toggle__label {
  font-size: 0.9rem;
  color: var(--color-text);
}

.remember-toggle__switch {
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 999px;
  background: var(--color-border);
  border: 2px solid var(--color-muted);
  transition: background 0.25s ease, border-color 0.25s ease;
  padding: 0;
  cursor: pointer;
}

.remember-toggle__switch--active {
  background: linear-gradient(90deg, var(--color-tertiary-1), var(--color-primary));
  border-color: var(--color-primary);
}

.remember-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-secondary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease;
}

.remember-toggle__switch--active .remember-toggle__thumb {
  transform: translateX(22px);
}
</style>
