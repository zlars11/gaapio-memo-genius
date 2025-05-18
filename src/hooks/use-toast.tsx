
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import { reducer, toast } from "./use-toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ToastContextType = {
  toasts: ToasterToast[]
}

const ToastContext = createContext<ToastContextType>({ toasts: [] })

function useToaster() {
  const [state, setState] = useState<ToasterToast[]>([])

  return {
    toasts: state,
    addToast: (toast: ToasterToast) => {
      setState(prev => [...prev, toast].slice(-TOAST_LIMIT))
    },
    updateToast: (toast: ToasterToast) => {
      setState(prev => prev.map(t => t.id === toast.id ? {...t, ...toast} : t))
    },
    dismissToast: (id?: string) => {
      setState(prev => prev.map(t => id === undefined || t.id === id ? {...t, open: false} : t))
    },
    removeToast: (id?: string) => {
      if (id === undefined) {
        setState([])
      } else {
        setState(prev => prev.filter(t => t.id !== id))
      }
    }
  }
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(reducer, {
    toasts: [],
  })

  return (
    <ToastContext.Provider value={state}>
      {children}
    </ToastContext.Provider>
  )
}

export { useToast, toast }
