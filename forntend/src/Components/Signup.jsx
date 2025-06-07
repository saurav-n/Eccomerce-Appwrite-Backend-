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
import axios from "axios";
import { useToast } from "./Toast/use-toast";

export default function Signup() {
    const [error, setError] = useState('');
    const [isLoading,setIsLoading]=useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {toast}=useToast()
    const signup = async (data) => {
        setError('')
        setIsLoading(true)
        try {
            const response=await axios.post('http://localhost:3000/api/auth/signup',data)
            if(response.data.success){
                console.log(response.data)
                toast({
                    description: `User registered successfully`,
                })
                navigate('/login')
            }
        } catch (e) {
            console.log(e)
            setError(e.response.data.message)
        }finally{
            setIsLoading(false)
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
                        label='User Name:'
                        className='w-full'
                        placeholder='Enter your user name'
                        {...register('userName', {
                            required: 'User name is required'
                        })}
                    />
                    {errors.userName && <p className='text-red-500 text-sm'>{errors.userName.message}</p>}
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
                            },
                            validate: {
                                password: (value) => {
                                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                                    return passwordRegex.test(value) || 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
                                }
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