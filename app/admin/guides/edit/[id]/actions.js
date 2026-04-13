'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateGuide(slug) {
  revalidatePath(`/guides/${slug}`)
  revalidatePath('/guides')
}
