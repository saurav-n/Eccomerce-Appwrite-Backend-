import { useForm } from "react-hook-form";
import { authService } from "../appwriteServices/authentication";
import { authActions } from "../app/authSlice";
import { userActions } from "../app/userSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Input from "./Input";
import Logo from "./Logo";
import { userDbService } from "../appwriteServices/database/userDb";
import Button from "./Button";

export default function Signup() {
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const signup = async (data) => {
        setError('')
        try {
            const newUserAccount = await authService.createUserAccount({
                email: data.email,
                password: data.password,
            })
            if(newUserAccount){
                const newUser=await userDbService.createUser({
                    accountId:newUserAccount.$id,
                    isSeller:false,
                    searchHistory:[],
                    carts:[],
                    cartItemQty:[]
                })
                if (newUser) {
                    dispatch(userActions.addUser(newUser))
                    const currentUser = await authService.logIn({
                        email: data.email,
                        password: data.password
                    })
                    if (currentUser) {
                        dispatch(authActions.logIn(currentUser))
                        navigate('/')
                    }
                }
            }
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <div className='w-full h-[600px] flex justify-center items-center px-2'>

            <div className='w-full max-w-[300px] flex flex-col items-center p-4 bg-white rounded-md shadow-md gap-y-3'>
                <div className='w-full flex flex-col items-center gap-y-1'>
                    <Logo className={'w-16 sm:w-20'} />
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                </div>
                <form
                    action=""
                    className='w-full flex flex-col gap-y-2'
                    onSubmit={handleSubmit(signup)}
                >
                    <Input
                        label='Email:'
                        className='w-full'
                        placeholder='Enter your email'
                        {...register('email', {
                            required: 'Email is required'
                        })}
                    />
                    {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                    <Input
                        label='Password:'
                        className='w-full'
                        type='password'
                        placeholder='Enter your password'
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password should be of minimum 8 characters'
                            }
                        })}
                    />
                    {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
                    <Button
                    type='submit'
                    className="w-full"
                    text='Sign Up'
                    />
                </form>
            </div>
        </div>
    )
}