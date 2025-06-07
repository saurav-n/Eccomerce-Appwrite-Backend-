import {useForm} from 'react-hook-form'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../appwriteServices/authentication';
import { useDispatch } from 'react-redux';
import { authActions } from '../app/authSlice';
import Logo from './Logo';
import Input from './Input';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Loader from './Loader';
import axios from 'axios';
import Spinner from './spinner';
import { useToast } from './Toast/use-toast';

export default function Login({relocatePath}){
    const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm()
    const navigate=useNavigate()
    const [error, setError] = useState('');
    const [isLoading,setIsLoading]=useState(false)
    const dispatch=useDispatch()
    const {toast}=useToast()
    const logIn=async (data)=>{
        setError('')
        setIsLoading(true)
        try {
            const response=await axios.post('http://localhost:3000/api/auth/signin',data)
            if(response.data.success){
                console.log(relocatePath)
                const token= response.data.data.token
                console.log(token)
                localStorage.setItem('token',token)
                toast({
                    description: `You logged in successfully`,
                })
                navigate('/')
            }
        } catch (e) {
            console.log(e)
            setError(e.response.data.message)
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <div className='w-full h-[600px] flex justify-center items-center px-2'>
            <div className='w-full max-w-[300px] flex flex-col items-center p-4 bg-white rounded-md shadow-md gap-y-3'>
                <div className='w-full flex flex-col items-center gap-y-1'>
                    <Logo className={'w-16 sm:w-20'}/>
                    <p className='text-gray-800 text-sm'>
                        Don't have an account?{<Link to={'/signup'} className='font-bold'>Sign Up</Link>}
                    </p>
                    {error&&<p className='text-red-500 text-sm'>{error}</p>}
                </div>
                <form 
                action=""
                className='w-full flex flex-col gap-y-2'
                onSubmit={handleSubmit(logIn)}
                >
                    <Input
                    label='User Name:'
                    className='w-full'
                    placeholder='Enter your user name'
                    {...register('userName',{
                        required:'User name is required'
                    })}
                    />
                    {errors.userName&&<p className='text-red-500 text-sm'>{errors.userName.message}</p>}
                    <Input
                    label='Password:'
                    className='w-full'
                    type='password'
                    placeholder='Enter your password'
                    {...register('password',{
                        required:'Password is required',
                        minLength:{
                            value:8,
                            message:'Password should be of minimum 8 characters'
                        }
                    })}
                    />
                    {errors.password&&<p className='text-red-500 text-sm'>{errors.password.message}</p>}
                    <Button
                    type='submit'
                    text={isLoading?<Spinner className={'w-5 h-5'}/>:'Sign In'}
                    // className='w-full'
                    />
                </form>
            </div>
        </div>
    )
}