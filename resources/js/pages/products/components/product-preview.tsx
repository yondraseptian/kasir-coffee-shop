"use client"

import { Eye, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ProductFormData, AvailableCategory, AvailableIngredient, AvailableUnit } from "@/types/product"
import { formatRupiah } from "@/lib/utils"

interface ProductPreviewProps {
  data: ProductFormData
  availableCategories?: AvailableCategory[]
  availableIngredients?: AvailableIngredient[]
  availableUnits?: AvailableUnit[]
  className?: string
}

export function ProductPreview({
  data,
  availableCategories = [],
  availableIngredients = [],
  availableUnits = [],
  className,
}: ProductPreviewProps) {
  const { name, price, category_id, image, ingredients } = data
  const hasData = name || price || category_id || ingredients.length > 0 || image

  // Temukan nama kategori
  const categoryName = availableCategories.find((cat) => cat.id === category_id)?.name

  // Handle URL image
  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image || null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Product Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Product Image Preview */}
          <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Product preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                  <p className="text-sm">No image uploaded</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold">{name || "Product Name"}</h3>
              {categoryName && (
                <Badge variant="secondary" className="mt-1">
                  {categoryName}
                </Badge>
              )}
            </div>

            <div className="text-2xl font-bold text-primary">
              {price ? formatRupiah(Number(price)) : "Rp 0.00"}
            </div>

            {ingredients.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Ingredients</h4>
                  <div className="space-y-1">
                    {ingredients.map((ingredient, index) => {
                      const ingredientName = availableIngredients.find((i) => i.id === ingredient.ingredient_id)?.name || ingredient.name || `Ingredient ${ingredient.ingredient_id}`
                      const unitName = availableUnits.find((u) => u.id === ingredient.unit_id)?.name || ingredient.unit_id

                      return (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {ingredient.quantity} {unitName} {ingredientName}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {!hasData && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">Fill out the form to see your product preview</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
