'use client';

import { Banknote, Coffee, CreditCard, LogOut, Minus, Plus, ShoppingCart, Smartphone, Thermometer, User, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FlashMessage } from '@/components/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatRupiah } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { UserMenu } from '@/components/user-menu';

interface MenuItemData {
    id: string;
    name: string;
    variants: {
        size: string;
        price: number;
        temperature: string;
    }[];
}

interface OrderItem {
    id: string;
    name: string;
    category: string;
    size: string;
    temperature: string;
    price: number;
    quantity: number;
}

interface Product {
    id: string;
    name: string;
    category_name: string;
    variants: {
        size: string;
        temperature: string;
        price: number;
    }[];
}

export default function CashierSystem({ products: initialProducts }: { products: Product[] }) {
    // Authentication state
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Item Configuration Modal State
    const [showItemConfigModal, setShowItemConfigModal] = useState(false);
    const [selectedProductForConfig, setSelectedProductForConfig] = useState<MenuItemData | null>(null);
    const [configSize, setConfigSize] = useState('Medium');
    const [configTemperature, setConfigTemperature] = useState('hot');
    const [configQuantity, setConfigQuantity] = useState(1);

    // Existing states
    const [customerType, setCustomerType] = useState('guest');
    const [memberNumber, setMemberNumber] = useState('');
    const [salesMode, setSalesMode] = useState('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [paymentMethod, setPaymentMethod] = useState('');
    const [products] = useState<Product[]>(initialProducts);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Menentukan kategori produk untuk filter
    const categories = ['All', ...Array.from(new Set(products.map((p) => p.category_name)))];
    const filteredProducts = selectedCategory === 'All' ? products : products.filter((p) => p.category_name === selectedCategory);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const salesModes = [
        { id: 'grab', name: 'Grab', color: 'bg-green-500' },
        { id: 'gojek', name: 'GoJek', color: 'bg-green-600' },
        { id: 'complement', name: 'Complement', color: 'bg-blue-500' },
        { id: 'shopee', name: 'Shopee', color: 'bg-orange-500' },
        { id: 'take_away', name: 'Take Away', color: 'bg-purple-500' },
        { id: 'delivery', name: 'Delivery', color: 'bg-red-500' },
    ];

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };
    const handleSettingsClick = () => {
        router.visit(route('profile.edit'));
  }

    const openItemConfig = (item: MenuItemData) => {
        setSelectedProductForConfig(item);
        setConfigSize('Medium'); // Reset to default
        setConfigTemperature('hot'); // Reset to default
        setConfigQuantity(1); // Reset quantity
        setShowItemConfigModal(true);
    };

    const handleAddItemToOrder = () => {
        if (!selectedProductForConfig) return;

        const selectedVariant = selectedProductForConfig.variants.find(
            (variant) => variant.size === configSize && variant.temperature === configTemperature,
        );

        const price = selectedVariant?.price ?? 0;

        const newItem: OrderItem = {
            id: selectedProductForConfig.id,
            name: selectedProductForConfig.name,
            category: selectedCategory,
            size: configSize,
            temperature: configTemperature,
            price: price,
            quantity: configQuantity,
        };

        const existingItemIndex = orderItems.findIndex(
            (orderItem) => orderItem.name === newItem.name && orderItem.size === newItem.size && orderItem.temperature === newItem.temperature,
        );

        if (existingItemIndex > -1) {
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            setOrderItems(updatedItems);
        } else {
            setOrderItems([...orderItems, newItem]);
        }

        setShowItemConfigModal(false);
        setSelectedProductForConfig(null);
    };

    const updateQuantity = (id: string, change: number) => {
        setOrderItems(
            (items) =>
                items
                    .map((item) => {
                        if (item.id === id) {
                            const newQuantity = Math.max(0, item.quantity + change);
                            return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
                        }
                        return item;
                    })
                    .filter(Boolean) as OrderItem[],
        );
    };

    const getTotalAmount = () => {
        return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getQueueNumber = () => {
        const today = new Date().toISOString().slice(0, 10); // "2025-07-13"
        const key = `queue_number_${today}`;
        const last = parseInt(localStorage.getItem(key) || '0');
        const next = last + 1;
        localStorage.setItem(key, next.toString());

        return String(next).padStart(4, '0'); // Output: "0001"
    };

    const handleProcessTransaction = () => {
        if (orderItems.length === 0) {
            alert('Pesanan masih kosong.');
            return;
        }

        if (!paymentMethod) {
            alert('Pilih metode pembayaran terlebih dahulu.');
            return;
        }

        const total = getTotalAmount();
        const discount = 0; // Ganti sesuai logic, misal diskon member 10% => total * 0.1
        const finalPrice = total - discount;

        const queueNum = getQueueNumber();

        const payload = {
            customer_name: customerType === 'member' ? memberNumber : 'Guest',
            sales_mode: salesMode,
            payment_method: paymentMethod,
            total_price: total,
            discount: discount,
            final_price: finalPrice,
            note: '',
            products: orderItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                temperature: item.temperature,
            })),
        };

        router.post(`/transactions?queue=${queueNum}`, payload, {
            onSuccess: () => {
                setOrderItems([]);
                setSalesMode('');
                setPaymentMethod('');
                setCustomerType('guest');
                setMemberNumber('');
            },
            onError: (errors) => {
                console.error('Gagal memproses transaksi', errors);
            },
        });
    };

    return (
        <>
            <Head title="Cashier" />
            <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
                {/* Header Bar */}
                <div className="flex-shrink-0 border-b bg-white px-6 py-4 shadow-sm">
                    <FlashMessage />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                                <Coffee className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Yoji Cashier</h1>
                            <Badge variant="outline" className="text-sm">
                                {salesMode ? salesMode.toUpperCase() : 'SELECT MODE'}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                {currentTime.toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className="font-mono text-lg font-bold">
                                {currentTime.toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>

                            {/* User Menu */}
                            <UserMenu handleLogout={handleLogout} onSettingsClick={handleSettingsClick} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel - Order Configuration */}
                    <div className="flex-1 space-y-6 overflow-y-auto p-6">
                        {/* Customer Type */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="guest" id="guest" />
                                        <Label htmlFor="guest" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Guest
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="member" id="member" />
                                        <Label htmlFor="member" className="flex items-center gap-2">
                                            <UserCheck className="h-4 w-4" />
                                            Member
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {customerType === 'member' && (
                                    <div className="mt-4">
                                        <Label htmlFor="memberNumber">Member Number</Label>
                                        <Input
                                            id="memberNumber"
                                            placeholder="Enter member number"
                                            value={memberNumber}
                                            onChange={(e) => setMemberNumber(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sales Mode */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales Mode</CardTitle>
                                <CardDescription>Select delivery or pickup method</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {salesModes.map((mode) => (
                                        <Button
                                            key={mode.id}
                                            variant={salesMode === mode.id ? 'default' : 'outline'}
                                            onClick={() => setSalesMode(mode.id)}
                                            className="h-12"
                                        >
                                            {mode.name}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="flex gap-4">
                                    {categories.map((category) => (
                                        <div key={category} className="flex items-center space-x-2">
                                            <RadioGroupItem value={category} id={category} />
                                            <Label htmlFor={category} className="flex items-center gap-2">
                                                <Coffee className="h-4 w-4" />
                                                {category}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Menu Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredProducts.map((item) => (
                                        <Card
                                            key={item.name}
                                            className="cursor-pointer transition-all hover:scale-105 hover:shadow-md"
                                            onClick={() => openItemConfig(item)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="text-center">
                                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                                                        <Coffee className="h-6 w-6 text-white" />
                                                    </div>
                                                    <h3 className="mb-1 text-sm font-semibold">{item.name}</h3>
                                                    <span className="mb-2 block text-sm font-medium text-green-600">
                                                        {/* {formatRupiah(item.variants[0].price)} */}
                                                    </span>
                                                    <Button onClick={() => openItemConfig(item)} className="h-8 w-full" size="sm">
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Select Options
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel - Order Summary */}
                    <div className="flex w-96 flex-col border-l border-gray-200 bg-white">
                        {/* Customer & Sales Mode Quick Info */}
                        <div className="border-b bg-gray-50 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Customer:</span>
                                <Badge variant={customerType === 'member' ? 'default' : 'secondary'}>
                                    {customerType === 'member' ? `Member ${memberNumber || '---'}` : 'Guest'}
                                </Badge>
                            </div>
                            {salesMode && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Mode:</span>
                                    <Badge variant="outline">{salesMode.toUpperCase()}</Badge>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                <h3 className="font-semibold">Order Summary</h3>
                                <Badge variant="secondary" className="ml-auto">
                                    {orderItems.reduce((total, item) => total + item.quantity, 0)} items
                                </Badge>
                            </div>

                            {orderItems.length === 0 ? (
                                <div className="py-12 text-center">
                                    <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-500">No items in order</p>
                                    <p className="mt-1 text-sm text-gray-400">Add items from the menu</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="rounded-lg bg-gray-50 p-3">
                                            <div className="mb-2 flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium">{item.name}</h4>
                                                    <div className="mt-1 flex gap-1">
                                                        <Badge variant="secondary" className="px-1 py-0 text-xs">
                                                            {item.size}
                                                        </Badge>
                                                        <Badge variant="secondary" className="px-1 py-0 text-xs">
                                                            {item.temperature}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">{formatRupiah(item.price * item.quantity)}</div>
                                                    <div className="text-xs text-gray-500">{formatRupiah(item.price)} each</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 w-6 bg-transparent p-0"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 w-6 bg-transparent p-0"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => updateQuantity(item.id, -item.quantity)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className="space-y-4 border-t bg-white p-4">
                            {/* Payment Method */}
                            <div>
                                <Label className="mb-2 block text-sm font-medium">Payment Method</Label>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="cash" id="cash" />
                                        <Label htmlFor="cash" className="flex items-center gap-2 text-sm">
                                            <Banknote className="h-4 w-4" />
                                            Cash
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex items-center gap-2 text-sm">
                                            <CreditCard className="h-4 w-4" />
                                            Card
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ewallet" id="ewallet" />
                                        <Label htmlFor="ewallet" className="flex items-center gap-2 text-sm">
                                            <Smartphone className="h-4 w-4" />
                                            E-Wallet
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Total */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600">{formatRupiah(getTotalAmount())}</span>
                                </div>
                                {customerType === 'member' && getTotalAmount() > 0 && (
                                    <div className="mt-1 text-xs text-gray-500">Points earned: {Math.floor(getTotalAmount() / 1000)}</div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Button
                                    className="h-12 w-full text-base font-semibold"
                                    disabled={orderItems.length === 0 || !salesMode || !paymentMethod}
                                    onClick={handleProcessTransaction}
                                >
                                    Process Payment
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="h-10 bg-transparent">
                                        Hold Order
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="h-10"
                                        onClick={() => setOrderItems([])}
                                        disabled={orderItems.length === 0}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item Configuration Dialog */}
                <Dialog open={showItemConfigModal} onOpenChange={setShowItemConfigModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{selectedProductForConfig?.name}</DialogTitle>
                            <DialogDescription>Configure size, temperature, and quantity for this item.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Price:</Label>
                                <span className="text-lg font-bold text-green-600">
                                    {(() => {
                                        const selectedVariant = selectedProductForConfig?.variants.find(
                                            (variant) => variant.size === configSize && variant.temperature === configTemperature,
                                        );

                                        const price = selectedVariant?.price ?? 0;

                                        return formatRupiah(price * configQuantity);
                                    })()}
                                </span>
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-semibold">Size</Label>
                                <RadioGroup value={configSize} onValueChange={setConfigSize} className="space-y-1">
                                    {[...new Set(selectedProductForConfig?.variants.map((v) => v.size))].map((size) => (
                                        <div key={size} className="flex items-center space-x-2">
                                            <RadioGroupItem value={size} id={`config-${size}`} />
                                            <Label htmlFor={`config-${size}`} className="text-sm capitalize">
                                                {size}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div>
                                <Label className="mb-2 flex items-center gap-1 text-sm font-semibold">
                                    <Thermometer className="h-3 w-3" />
                                    Temperature
                                </Label>
                                <RadioGroup value={configTemperature} onValueChange={setConfigTemperature} className="space-y-1">
                                    {[...new Set(selectedProductForConfig?.variants.map((v) => v.temperature))].map((size) => (
                                        <div key={size} className="flex items-center space-x-2">
                                            <RadioGroupItem value={size} id={`config-${size}`} />
                                            <Label htmlFor={`config-${size}`} className="text-sm capitalize">
                                                {size}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div>
                                <Label htmlFor="quantity" className="mb-2 block text-sm font-semibold">
                                    Quantity
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setConfigQuantity(Math.max(1, configQuantity - 1))}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={configQuantity}
                                        onChange={(e) => setConfigQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                        className="w-20 text-center"
                                        min="1"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => setConfigQuantity(configQuantity + 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowItemConfigModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddItemToOrder}>Add to Order</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Logout Confirmation Dialog */}
                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Logout</DialogTitle>
                            <DialogDescription>Are you sure you want to logout? Any unsaved orders will be lost.</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                                Cancel
                            </Button>
                            <Link href={route('logout')} method="post">
                                <Button variant="destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </Link>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
