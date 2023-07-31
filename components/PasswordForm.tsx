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
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand, AlertTriangle } from 'lucide-react'
import styles from '@/styles/Home.module.css'

export function PasswordForm({ onSubmit } : { onSubmit : any}) {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Dialog>
          <DialogContent className="sm:max-w-[850px] text-black overflow-scroll max-h-screen overscroll-none">
            <DialogHeader>
              <DialogTitle>Please enter the password to Jamie Sun</DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit}>
              <div className="grid gap-4 py-4 text-slate-700">
                <div className="relative">
                  <Input
                    placeholder="Enter password here..."
                    name="passwordInput"
                    type="password"
                    className="col-span-3"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-red-500">
                    Ask
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
