'use client';

import { usePage, router } from '@inertiajs/react';
import type {
  AvailableCategory,
  AvailableIngredient,
  AvailableUnit,
} from '@/types/product';
import { ProductForm } from './components/product-form';

export default function ProductCreateForm() {
  const { categories, ingredients, units } = usePage().props as unknown as{
    categories: AvailableCategory[];
    ingredients: AvailableIngredient[];
    units: AvailableUnit[];
  };

  const handleSubmit = (formData: FormData) => {
    router.post(route('products.store'), formData, {
      forceFormData: true,
      onSuccess: () => {
        console.log(formData);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      },
    });
  };

  const handleCancel = () => {
    router.visit('/products');
  };

  return (
    <ProductForm
      title="Create New Product"
      showPreview={true}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText="Create Product"
      cancelButtonText="Cancel"
      availableCategories={categories}
      availableIngredients={ingredients}
      availableUnits={units}
      initialData={{
        name: '',
        price: '',
        category_id: '',
        image: null,
        ingredients: [],
      }}
    />
  );
}
