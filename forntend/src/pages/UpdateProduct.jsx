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
import { useParams } from 'react-router-dom';

const schema = yup.object({
    itemName: yup.string().required('Item name is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    price: yup.number().required('Price is required').positive('Price must be positive'),
    stock: yup.number().required('Stock is required').positive('Stock must be positive'),
    images: yup.array().max(3, 'Maximum 3 images allowed')
}).required();

export default function UpdateProduct() {
    const dispatch = useDispatch();
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const { isLoading: isCategoryLoading, categories, error: categoryError } = useSelector(state => state.category);
    const { isLoading: isItemLoading, items, error: itemError } = useSelector(state => state.item);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCategoryAdding, setIsCategoryAdding] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchItems({}))
    }, [dispatch]);

    useEffect(() => {
        if (items && id) {
            const item = items.find(item => item._id === id);
            if (item) {
                setValue('itemName', item.name);
                setValue('description', item.description);
                setValue('category', item.category);
                setValue('price', item.price);
                setValue('stock', item.stock);
                setSelectedCategory(item.category);
                setSelectedImages(item.featuredImgs || []);
            }
        }
    }, [items, id, setValue]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...selectedImages, ...files];
        if (newImages.length <= 3) {
            setSelectedImages(newImages);
        } else {
            toast({
                description: 'Maximum 3 images allowed',
            });
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const onSubmit = async (data) => {
    try {
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('name', data.itemName);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('itemId', id);

        // Separate new files and existing URLs
        const newFiles = [];
        const existingUrls = [];

        selectedImages.forEach(image => {
            if (image instanceof File) {
                // New file uploads
                newFiles.push(image);
            } else if (typeof image === 'string') {
                // Existing image URLs
                existingUrls.push(image);
            }
        });

        // Append new files
        newFiles.forEach(file => {
            formData.append('newFeaturedImgs', file); // Using different field name for new files
        });

        // Append existing URLs as JSON string
        formData.append('existingFeaturedImgs', JSON.stringify(existingUrls));

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/updateItem`, 
            formData, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data.success) {
            toast({
                description: `Product "${data.itemName}" updated!`,
                variant: 'success'
            });
            dispatch(fetchItems({}));
            navigate('/');
        }
    } catch (error) {
        console.error('Update error:', error);
        setError(error.response?.data?.message || 'Error updating product');
    } finally {
        setLoading(false);
    }
};
    const handleAddNewCategory = async () => {
        console.log('Add category function')
        if (newCategoryName.trim() === '') {
            toast({
                description: 'Category name cannot be empty',
            });
            return;
        }
        try {
            setIsCategoryAdding(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/addCategory`, { categoryName: newCategoryName }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                toast({
                    description: `Category "${newCategoryName}" added!`,
                    variant: 'success'
                });
                dispatch(fetchCategories());
                setNewCategoryName('');
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message.startsWith('jwt') || error.message.startsWith('jwt')) {
                navigate('/login');
            }
        } finally {
            setIsCategoryAdding(false);
        }
    };

    if (isItemLoading || isCategoryLoading) {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <Loader />
                </div>
            </Container>
        );
    }

    if (itemError || categoryError) {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <p className="text-red-500">{itemError || categoryError}</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <h1 className="text-2xl font-bold mb-8 text-center">Update Product</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Item Name</Label>
                            <Input
                                id="itemName"
                                {...register('itemName')}
                                placeholder="Enter item name"
                            />
                            {errors.itemName && (
                                <p className="text-sm text-red-600">{errors.itemName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Description</Label>
                            <Input
                                id="description"
                                {...register('description')}
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

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
                                        {categoryError ? (
                                            <p className="text-red-500">{categoryError}</p>
                                        ) : isCategoryLoading ? (
                                            <div>
                                                <Skeleton className="w-full h-10" />
                                                <Skeleton className="w-full h-10" />
                                                <Skeleton className="w-full h-10" />
                                            </div>
                                        ) : (
                                            categories.map((category) => (
                                                <SelectItem key={category._id} value={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors.category && (
                                <p className="text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                {...register('price')}
                                step="0.01"
                                placeholder="Enter price"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-600">{errors.price.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                {...register('stock')}
                                placeholder="Enter stock quantity"
                            />
                            {errors.stock && (
                                <p className="text-sm text-red-600">{errors.stock.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700">Images</Label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <div className="w-full h-20">
                                                <img
                                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
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
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? <Loader /> : 'Update Product'}
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}