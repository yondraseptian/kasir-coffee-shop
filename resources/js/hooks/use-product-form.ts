"use client"

import { useState, useCallback } from "react"
import type { ProductFormData, Ingredient } from "@/types/product"

export function useProductForm(initialData?: Partial<ProductFormData>) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    price: initialData?.price || "",
    category_id: initialData?.category_id || "",
    image: initialData?.image || null,
    ingredients: initialData?.ingredients || [],
  })

  const updateField = useCallback(
    (field: keyof ProductFormData, value: ProductFormData[keyof ProductFormData]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const addIngredient = useCallback((ingredient: Ingredient) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }))
  }, [])

  const removeIngredient = useCallback((ingredientId: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.ingredient_id !== ingredientId),
    }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      price: "",
      category_id: "",
      image: null,
      ingredients: [],
    })
  }, [])

  return {
    formData,
    updateField,
    addIngredient,
    removeIngredient,
    resetForm,
  }
}
