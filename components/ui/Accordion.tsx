'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-forest/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-body font-medium text-forest text-sm md:text-base">{title}</span>
        <ChevronDown
          size={18}
          className={`text-forest/60 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`
          grid transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-forest/70 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
