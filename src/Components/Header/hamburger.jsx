import { GiHamburgerMenu } from "react-icons/gi"
export default function Hamburger({onClickHandler, className}){
    return(
        <button onClick={onClickHandler} className={className}>
            <GiHamburgerMenu/>
        </button>
    )
}