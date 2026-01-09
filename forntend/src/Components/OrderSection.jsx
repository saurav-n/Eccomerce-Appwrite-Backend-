"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion"
import OrdersTable from "./OrdersTable"
export default function OrdersSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="orders" className="border border-blue-200 rounded-lg overflow-hidden">
          <AccordionTrigger
            onClick={() => setIsOpen(!isOpen)}
            className="px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ChevronDown className={`h-5 w-5 text-blue-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              <h2 className="text-xl font-semibold text-blue-900">My Orders</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <OrdersTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
