import { useState } from "react"

export function useCategories(initial: { id: number; name: string }[]) {
  const [categories, setCategories] = useState(initial)
  const [newCategory, setNewCategory] = useState("")

  const handleAddNewCategory = () => {
    const trimmed = newCategory.trim()
    if (!trimmed) return null

    // Cek apakah nama kategori sudah ada
    const exists = categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())
    if (exists) return null

    // Tambah kategori baru
    const newCat = { id: Date.now(), name: trimmed }
    setCategories([...categories, newCat])
    setNewCategory("")
    return newCat
  }

  return {
    categories,
    newCategory,
    setNewCategory,
    handleAddNewCategory,
  }
}
