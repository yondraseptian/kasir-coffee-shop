"use client"

import { useState } from "react"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCategories } from "@/hooks/use-categories"

interface CategorySelectorProps {
  categories: { id: number; name: string }[]
  selectedCategory: string | number
  onCategoryChange: (category: string) => void
  label?: string
}

export function CategorySelector({
  categories: initialCategories,
  selectedCategory,
  onCategoryChange,
  label = "Category",
}: CategorySelectorProps) {
  const { categories, newCategory, setNewCategory, handleAddNewCategory } = useCategories(initialCategories)

  const [showDialog, setShowDialog] = useState(false)

  const handleAddCategory = () => {
    const added = handleAddNewCategory()
    if (added) {
      onCategoryChange(added.id.toString())
      setShowDialog(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select value={selectedCategory?.toString()} onValueChange={onCategoryChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Category Name</Label>
                <Input
                  id="new-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} className="flex-1">
                  Add Category
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
