/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, XCircle, Eye, RefreshCw } from "lucide-react"
import type { ExcelUploaderProps, UploadedRow } from "../types/excel-uploader"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx"

export default function ExcelUploader({ template, onDataImport, className }: ExcelUploaderProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedData, setUploadedData] = useState<UploadedRow[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (!file) return

  setUploadedFile(file)
  setIsProcessing(true)
  setProcessingProgress(0)

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as UploadedRow[]

    // Validasi setiap baris
    const validatedData = jsonData.map((row) => {
      const errors: string[] = []

      template.columns.forEach((column: any) => {
        const value = row[column.name]
        if (column.required && !value) {
          errors.push(`${column.name} is required`)
        }
        if (column.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`Invalid ${column.name} format`)
        }
        if (column.validation && value) {
          const customError = column.validation(value)
          if (customError) errors.push(customError)
        }
      })

      return {
        ...row,
        _validation: {
          status:
            errors.length === 0
              ? "valid"
              : errors.some((e) => e.toLowerCase().includes("required") || e.toLowerCase().includes("must"))
              ? "error"
              : "warning",
          errors,
        },
      }
    })

    setUploadedData(validatedData)
    setIsProcessing(false)
    setProcessingProgress(100)
    setActiveTab("review")
  }

  reader.readAsArrayBuffer(file)
}

  const downloadTemplate = () => {
    console.log(`Downloading ${template.name}...`)
    // In a real app, this would generate and download an actual Excel template
  }

  const getValidationStats = () => {
    const valid = uploadedData.filter((row) => row._validation?.status === "valid").length
    const warnings = uploadedData.filter((row) => row._validation?.status === "warning").length
    const errors = uploadedData.filter((row) => row._validation?.status === "error").length
    return { valid, warnings, errors, total: uploadedData.length }
  }

  const handleImport = () => {
    const validData = uploadedData.filter((row) => row._validation?.status !== "error")
    onDataImport?.(validData)
  }

  const stats = getValidationStats()

  return (
    <div className={cn("max-w-6xl mx-auto p-6 space-y-6", className)}>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{template.name}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="review" disabled={uploadedData.length === 0}>
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={downloadTemplate} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Example</TableHead>
                      {template.columns.some((col) => col.options) && <TableHead>Options</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.columns.map((column, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{column.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{column.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {column.required ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="secondary">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{column.example}</TableCell>
                        {template.columns.some((col: any) => col.options) && (
                          <TableCell>
                            {column.options ? (
                              <div className="flex flex-wrap gap-1">
                                {column.options.slice(0, 3).map((option, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                                {column.options.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{column.options.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Excel File
              </CardTitle>
              <CardDescription>
                Select your Excel file to import data. Make sure it follows the template format.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excel-file">Excel File</Label>
                <Input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </div>

              {uploadedFile && (
                <Alert>
                  <FileSpreadsheet className="w-4 h-4" />
                  <AlertDescription>
                    Selected file: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing file...</span>
                  </div>
                  <Progress value={processingProgress} className="w-full" />
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveTab("template")} className="flex-1 sm:flex-none">
                  View Template
                </Button>
                <Button
                  onClick={() => setActiveTab("review")}
                  disabled={uploadedData.length === 0}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-500">{stats.valid}</p>
                    <p className="text-sm text-muted-foreground">Valid Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{stats.warnings}</p>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-500">{stats.errors}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Preview & Validation</CardTitle>
              <CardDescription>
                Review your imported data and fix any validation errors before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Status</TableHead>
                        {template.columns.map((column) => (
                          <TableHead key={column.name}>{column.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {row._validation?.status === "valid" && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {row._validation?.status === "warning" && (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            )}
                            {row._validation?.status === "error" && <XCircle className="w-4 h-4 text-red-500" />}
                          </TableCell>
                          {template.columns.map((column) => (
                            <TableCell
                              key={column.name}
                              className={
                                row._validation?.status === "error" &&
                                row._validation?.errors?.some((error: string) =>
                                  error.toLowerCase().includes(column.name.toLowerCase()),
                                )
                                  ? "bg-red-50 text-red-900"
                                  : ""
                              }
                            >
                              {row[column.name] || <span className="text-muted-foreground italic">Empty</span>}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {uploadedData.some((row) => row._validation?.errors?.length > 0) && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Validation Issues:</h4>
                  {uploadedData.map(
                    (row, index) =>
                      row._validation?.errors?.length > 0 && (
                        <Alert key={index} variant="destructive">
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>
                            <strong>Row {index + 1}:</strong> {row._validation.errors.join(", ")}
                          </AlertDescription>
                        </Alert>
                      ),
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setActiveTab("upload")} className="flex-1 sm:flex-none">
                  Upload New File
                </Button>
                <Button disabled={stats.errors > 0} onClick={handleImport} className="flex-1 sm:flex-none">
                  Import Data ({stats.valid} records)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
