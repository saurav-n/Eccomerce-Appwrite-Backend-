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

export default function Login({relocatePath}){
    const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm()
    const navigate=useNavigate()
    const [error, setError] = useState('');
    const dispatch=useDispatch()
    const logIn=async (data)=>{
        setError('')
        try {
            const currentUser=await authService.logIn({email:data.email,password:data.password})
            if(currentUser) {
                dispatch(authActions.logIn(currentUser))
                console.log(relocatePath)
                navigate(relocatePath)
            }
        } catch (e) {
            setError(e.message)
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
                    label='Email:'
                    className='w-full'
                    placeholder='Enter your email'
                    {...register('email',{
                        required:'Email is required'
                    })}
                    />
                    {errors.email&&<p className='text-red-500 text-sm'>{errors.email}</p>}
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
                    text={isSubmitting?<Loader/>:'Sign In'}
                    // className='w-full'
                    />
                </form>
            </div>
        </div>
    )
}