export default function Spinner({ className }) {
    return (
        <div className={`inline-block relative ${className ? className : 'w-10 h-10'}`}>
            <div className="absolute w-full h-full rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
    )
}