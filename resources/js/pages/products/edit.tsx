import { ProductForm } from './components/product-form'
import { router } from '@inertiajs/react'

export default function Edit({ product, categories, ingredients, units }) {
  const handleUpdate = (formData: FormData) => {
    formData.append('_method', 'PUT');
    router.post(route('products.update', product.id), formData, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        console.log(formData);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      }
    });
  }

  return (
    <ProductForm
      initialData={{
        ...product,
        image: product.image ? `/storage/${product.image}` : null,
      }}
      availableCategories={categories}
      availableIngredients={ingredients}
      availableUnits={units}
      submitButtonText="Update Product"
      title="Edit Product"
      onSubmit={handleUpdate}
    />
  )
}
