'use client'

import Image from 'next/image'
import * as React from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCompletion } from 'ai/react'
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand, AlertTriangle } from 'lucide-react'
import { MemoizedReactMarkdown } from '@/components/markdown'

export function PasswordForm({ onSubmit } : { onSubmit : any}) {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div id="passwordForm">
          <h2>Enter the Password to Access the Website:</h2>
          <form onSubmit={onSubmit}>
            <input type="password" name="passwordInput" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </main>
  )
}
