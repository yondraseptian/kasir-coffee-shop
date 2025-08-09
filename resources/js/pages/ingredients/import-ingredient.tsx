"use client"

import { useState } from "react"
import ExcelUploader from "@/components/excel-uploader"
import type { TemplateConfig, UploadedRow } from "@/types/excel-uploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"

export const ingredientTemplate: TemplateConfig = {
  name: "Ingredient Import Template",
  description: "Use this template to import ingredient data including nutritional information and allergen details",
  columns: [
    {
      name: "Ingredient Code",
      key: "ingredient_code",
      type: "text",
      required: true,
      example: "ING-001",
      validation: (value) => {
        if (!value || value.length < 3) return "Ingredient code must be at least 3 characters"
        return null
      },
    },
    {
      name: "Ingredient Name",
      key: "name",
      type: "text",
      required: true,
      example: "Organic Tomatoes",
    },
    {
      name: "Category",
      key: "category",
      type: "select",
      required: true,
      example: "Vegetables",
      options: ["Vegetables", "Fruits", "Grains", "Proteins", "Dairy", "Spices", "Other"],
    },
    {
      name: "Unit of Measure",
      key: "unit",
      type: "select",
      required: true,
      example: "kg",
      options: ["kg", "g", "L", "mL", "pieces", "cups", "tbsp", "tsp"],
    },
    {
      name: "Cost per Unit",
      key: "cost_per_unit",
      type: "number",
      required: true,
      example: "2.50",
      validation: (value) => {
        const num = Number.parseFloat(value)
        if (isNaN(num) || num <= 0) return "Cost must be a positive number"
        return null
      },
    },
  ],
}

export default function IngredientUploadPage() {
  const [importedIngredients, setImportedIngredients] = useState<UploadedRow[]>([])

  const handleIngredientImport = (data: UploadedRow[]) => {
    setImportedIngredients(data)
    console.log("Imported ingredients:", data)
    // Here you would typically send the data to your API
  }

  return (
    <div className="space-y-6">
      {importedIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Import Successful
            </CardTitle>
            <CardDescription>Successfully imported {importedIngredients.length} ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {importedIngredients.slice(0, 5).map((ingredient, index) => (
                <Badge key={index} variant="secondary">
                  {ingredient["Ingredient Name"]}
                </Badge>
              ))}
              {importedIngredients.length > 5 && (
                <Badge variant="outline">+{importedIngredients.length - 5} more</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <ExcelUploader template={ingredientTemplate} onDataImport={handleIngredientImport} />
    </div>
  )
}
