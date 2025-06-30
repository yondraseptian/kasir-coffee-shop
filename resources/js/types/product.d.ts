export interface Ingredient {
    name?: string;
    ingredient_id: number;
    quantity: number;
    unit_id: number;
  }
  
  export interface ProductFormData {
    id?: number // opsional jika kamu mendukung edit
    name: string
    price: number | string
    category_id: string | number
    image: string | null
    ingredients: Ingredient[]
  }
  // Kategori yang tersedia untuk dipilih
  export interface AvailableCategory {
    id: number
    name: string
  }
  
  // Bahan baku yang tersedia dari backend
  export interface AvailableIngredient {
    id: number
    name: string
    quantity: number
    unit_id: number
  }
  
  // Unit (satuan) dari bahan baku
  export interface AvailableUnit {
    id: number
    name: string
    abbreviation: string
  }
  
  export interface ProductFormConfig {
    availableCategories?: AvailableCategory[]
    availableIngredients?: AvailableIngredient[]
    availableUnits?: AvailableUnit[]
    showPreview?: boolean
    onSubmit?: (data: FormData) => void
    onCancel?: () => void
    submitButtonText?: string
    cancelButtonText?: string
    title?: string
  }
  
  export interface ProductFormProps extends ProductFormConfig {
    initialData?: Partial<ProductFormData>
    className?: string
  }
  