/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Coffee,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  MapPin,
  User,
} from "lucide-react"
import { usePage } from "@inertiajs/react"
import { formatRupiah } from "@/lib/utils"

export default function TransactionDetail() {
  const { transaction } = usePage().props as any

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "processing":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       case "failed":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "pending":
//         return "bg-gray-100 text-gray-800 border-gray-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coffee Shop Order</h1>
          <p className="text-muted-foreground">Order details and receipt</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Invoice
          </Button>
        </div>
      </div>

      {/* Transaction Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <Coffee className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Order {transaction.customer_name}</CardTitle>
                <CardDescription>Coffee shop order receipt</CardDescription>
              </div>
            </div>
            {/* <Badge className={getStatusColor(transaction.status)}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold">{formatRupiah(transaction.total_price)}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">Bill Num</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{transaction.bill_number}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.bill_number)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">Order Time</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{formatDate(transaction.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cashier</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-3 h-3 text-amber-600" />
                </div>
                <span className="text-sm font-medium">{transaction.user_name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {transaction.payment_method}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Items Ordered</h4>
              <div className="space-y-3">
                {transaction.details.map((item : any, index : number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatRupiah(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{formatRupiah(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              {/* <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm">{formatCurrency(transaction.total_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="text-sm">{formatCurrency(transaction.tax, "USD")}</span>
              </div> */}
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span>{formatRupiah(transaction.total_price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Timeline */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Transaction Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transaction.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      event.status === "completed"
                        ? "bg-green-500"
                        : event.status === "processing"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(event.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Available actions for this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Order ID
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Track Order Status
            </Button>
            <Button variant="outline" size="sm">
              Reorder Items
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}