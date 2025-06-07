import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Container from "@/Components/Container";
import { useState, useEffect } from 'react';
import Button from "@/Components/Button";
import Input from "@/Components/Input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/app/categorySlice';
import { fetchItems } from '@/app/itemSlice';
import { Skeleton } from '@/Components/skeleton';
import { useToast } from '@/Components/Toast/use-toast';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Trash } from 'lucide-react';
import Loader from '@/Components/Loader';

const schema = yup.object({
    itemName: yup.string().required('Item name is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    price: yup.number().required('Price is required').positive('Price must be positive'),
    stock: yup.number().required('Stock is required').positive('Stock must be positive'),
    images: yup.array().max(3, 'Maximum 3 images allowed')
}).required();

export default function AddProduct() {
    const dispatch = useDispatch()
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const { isLoading: isCategoryLoading, categories, error: categoryError } = useSelector(state => state.category)
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCategoryAdding, setIsCategoryAdding] = useState(false)
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()

    // Simulate fetching categories on mount
    // useEffect(() => {
    //   // Replace with your actual API call to fetch categories
    //   const fetchCategories = async () => {
    //     // const response = await fetch('/api/categories');
    //     // const data = await response.json();
    //     // setCategories(data);
    //   };
    //   fetchCategories();
    // }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...selectedImages, ...files];
        if (newImages.length <= 3) {
            setSelectedImages(newImages);
        } else {
            toast({
                description: 'Maximum 3 images allowed',
            })
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const onSubmit = async (data) => {
        if (!selectedImages.length) {
            toast({
                description: 'Please select at least one image',
            })
            return
        }

        const formData = new FormData()
        formData.append('name', data.itemName)
        formData.append('description', data.description)
        formData.append('category', data.category)
        formData.append('price', data.price)
        formData.append('stock', data.stock)

        // Append each image file individually
        selectedImages.forEach((image, index) => {
            formData.append(`featuredImgs`, image)
        })

        console.log(formData)
        try {
            setLoading(true)
            setError('')
            const response = await axios.post('http://localhost:3000/api/admin/addItem', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.data.success) {
                toast({
                    description: `Item "${data.itemName}" added!`,
                })
                dispatch(fetchItems())
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            if (error.response?.data?.message.startsWith('jwt') || error.message.startsWith('jwt')) {
                navigate('/login')
            }
            setError(error.response?.data?.message)
        }finally{
            setLoading(false)
        }
    };

    const handleAddNewCategory = async () => {
        if (newCategoryName.trim() === '') {
            toast({
                description: 'Category name cannot be empty',
            })
            return;
        }
        try {
            setIsCategoryAdding(true)
            const response = await axios.post('http://localhost:3000/api/admin/addCategory', { categoryName: newCategoryName }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                toast({
                    description: `Category "${newCategoryName}" added!`,
                })
                dispatch(fetchCategories())
            }
        } catch (error) {
            console.log(error)
            if (error.response.data.message.startsWith('jwt') || error.message.startsWith('jwt')) {
                navigate('/login')
            }
        } finally {
            setIsCategoryAdding(false)
        }
    };

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    return (
        <Container>
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <h1 className="text-2xl font-bold mb-8 text-center">Add New Product</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Item Name</Label>
                            <input
                                {...register('itemName')}
                                type="text"
                                placeholder="Enter item name"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.itemName && (
                                <p className="text-sm text-red-600">{errors.itemName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Description</Label>
                            <textarea
                                {...register('description')}
                                rows="4"
                                placeholder="Enter product description"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Category Select and Add Category Popover */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</Label>
                            <div className="flex flex-col gap-2">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => {
                                        setSelectedCategory(value);
                                        setValue('category', value);
                                    }}
                                >
                                    <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="min-h-[40px]">
                                        {categoryError ? <p>{categoryError}</p> : isCategoryLoading ? <div>
                                            <Skeleton className='w-full h-10' />
                                            <Skeleton className='w-full h-10' />
                                            <Skeleton className='w-full h-10' />
                                        </div> : categories.map((category) => (
                                            <SelectItem key={category._id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button variant="outline" className="w-full">
                                            Add New Category
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Add Category</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Enter the name for the new category.
                                                </p>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="newCategoryName">Category Name</Label>
                                                <Input
                                                    id="newCategoryName"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="e.g. Smartphones"
                                                />
                                                <Button onClick={handleAddNewCategory} disabled={isCategoryAdding}>{isCategoryAdding ? 'Adding...' : 'Add Category'}</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {errors.category && (
                                <p className="text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Price</Label>
                            <input
                                {...register('price')}
                                type="number"
                                step="0.01"
                                placeholder="Enter price"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-600">{errors.price.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Stock</Label>
                            <input
                                {...register('stock')}
                                type="number"
                                placeholder="Enter stock quantity"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.stock && (
                                <p className="text-sm text-red-600">{errors.stock.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Featured Images (Max 3)</Label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {selectedImages.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-4">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative w-24">
                                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                                <div className="h-16">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-content justify-center bg-red-500 hover:bg-red-600"
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <Trash className="w-4 h-4"/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        >
                            {loading ? <Loader /> : 'Add Product'}
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}