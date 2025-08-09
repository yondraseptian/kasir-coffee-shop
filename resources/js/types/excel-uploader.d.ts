/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ColumnConfig {
  name: string
  key: string
  type: "text" | "number" | "email" | "date" | "boolean" | "select"
  required: boolean
  example: string
  options?: string[] // For select type
  helperText?: string
  validation?: (value: any) => string | null
}

export interface TemplateConfig {
  name: string
  description: string
  columns: ColumnConfig[]
}

export interface ValidationResult {
  status: "valid" | "warning" | "error"
  errors: string[]
}

export interface UploadedRow {
  [key: string]: any
  _validation?: ValidationResult
}

export interface ExcelUploaderProps {
  template: TemplateConfig
  onDataImport?: (data: UploadedRow[]) => void
  className?: string
}
