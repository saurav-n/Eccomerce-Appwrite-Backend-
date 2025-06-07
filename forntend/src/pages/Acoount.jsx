import Login from "../Components/Login";

export default function Account(){
    return(
        <div className="w-full px-2 min-h-[600px] flex flex-wrap justify-center items-center">
            {
                <Login relocatePath={'/'}/>
            }
        </div>
    )
}