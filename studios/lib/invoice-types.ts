export interface InvoiceItem {
  id?: number
  name: string
  description?: string
  quantity: string
  unit_price: string
  line_total?: string
}

export interface InvoicePayment {
  id: number
  receipt_number: string
  amount: string
  paid_at: string
  payment_method?: string
  reference?: string
  balance_after: string
  created_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  business_name: string
  business_email?: string
  client_name: string
  client_email?: string
  client_phone?: string
  client_address?: string
  issue_date: string
  due_date: string
  currency: string
  tax_rate: string
  discount_rate: string
  items: InvoiceItem[]
  notes?: string
  payment_instructions?: string
  terms?: string
  totals: {
    subtotal: string
    discount_amount: string
    tax_amount: string
    total: string
  }
  amount_paid: string
  balance_due: string
  payment_status: "unpaid" | "partially_paid" | "paid" | string
  payments: InvoicePayment[]
}

export function formatInvoiceAmount(value: string | number, currency: string) {
  return `${currency} ${value}`
}
