import { useEffect, useRef, useState } from "react";
import Container from "@/Components/Container";
import FilterBox from "@/Components/filterBox";
import Loader from "@/Components/Loader";
import DisplayCart from "@/Components/DisplayCart";
import HorizontalDisplayCart from "@/Components/HorizontalDisplayCart";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/dialog"
import { ShadCnButton } from "@/Components/ShadCnButton";
import { IoGrid } from "react-icons/io5";
import { HiViewList } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/userSlice";
import { userDbService } from "@/appwriteServices/database/userDb";
import { useContext } from "react";
import { LoadingContext } from "@/app/Loadingcontext";
import nameCompare from "@/utils/NameCompare";

export default function Product() {
    const { isAppLoading } = useContext(LoadingContext)
    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.userData)
    const users = useSelector(state => state.user.users)
    const items = useSelector(state => state.item.items)
    const [currentUser] = userData ? users.filter(user => userData.$id === user.accountId) : [null]
    const [orderOfItems, setOrderOfItems] = useState('Grid');
    const [category, setCategory] = useState('All');
    const [selectedSortType, setSelectedSortType] = useState('');
    const [isOrderedAscendingly, setIsOrderedAscendingly] = useState(true);
    const [priceRange, setPriceRange] = useState(500000);
    const [searchText, SetSearchText] = useState('');
    const [searchedVal, setSearchedVal] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [filteredItems, setFilteredItems] = useState([])

    const searchBarRef = useRef(null)
    useEffect(() => {
        setFilteredItems(items)
        setSuggestions(currentUser ? currentUser.searchHistory : [])
    }, [isAppLoading])

    useEffect(() => {
        setSuggestions(
            currentUser ? currentUser.searchHistory.filter(searchedText =>
                searchedText.toLowerCase().includes(searchText.toLowerCase())
            ) : []
        )
    }, [searchText])

    useEffect(() => {
        const updateSearchHistory = async () => {
            try {
                if (currentUser && searchedVal && !currentUser.searchHistory.includes(searchedVal[0].toUpperCase() + searchedVal.slice(1))) {
                    const updatedUser = await userDbService.updateUser({
                        userId: currentUser.$id,
                        ...currentUser,
                        searchHistory: [...currentUser.searchHistory, searchedVal[0].toUpperCase() + searchedVal.slice(1)]
                    })
                    dispatch(userActions.updateUser({ id: currentUser.accountId, updatedUser }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        updateSearchHistory()
        console.log(`searching ${searchedVal}`)
        setFilteredItems(
            filteredItems.filter(item => item.name.toLowerCase().includes(searchedVal.toLowerCase()))
        )
        SetSearchText('')
        setSearchedVal('')
        setActiveSuggestionIndex(-1)
        setIsSearching(false)
    }, [searchedVal])

    useEffect(() => {
        setFilteredItems(
            items.filter(item => category === 'All' || item.genre.toLowerCase() === category.toLowerCase()).
            filter(item => parseInt(item.price.slice(3)) <= priceRange).
            toSorted((firstItem, secondItem) =>
                (selectedSortType === 'byName' ?
                    (isOrderedAscendingly ?
                            nameCompare(firstItem.name, secondItem.name) :
                            nameCompare(secondItem.name, firstItem.name)
                    ) :
                    (selectedSortType === 'byPrice' ?
                        (isOrderedAscendingly ?
                            parseInt(firstItem.price.slice(3)) - parseInt(secondItem.price.slice(3)) :
                            parseInt(secondItem.price.slice(3)) - parseInt(firstItem.price.slice(3))
                        ) : 0
                    )
                )
            )
        )

    }, [category, selectedSortType, isOrderedAscendingly, priceRange])
    useEffect(() => {
        console.log(filteredItems)
    }, [filteredItems])

    return (<Container>
        <div className="w-full h-full py-10 px-2 flex justify-center items-center">
            <div className="w-full max-w-[1000px] flex justify-center">
                <div className="hidden sm:flex sm:pr-8">
                    <FilterBox
                        category={category}
                        setCategory={setCategory}
                        sortTypes={[
                            {
                                value: 'byName',
                                label: 'By Name'
                            },
                            {
                                value: 'byPrice',
                                label: 'By Price'
                            }
                        ]}
                        selectedSortType={selectedSortType}
                        setSelectedSortType={setSelectedSortType}
                        isOrderedAssccendingly={isOrderedAscendingly}
                        setIsOrderedAscendingly={setIsOrderedAscendingly}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        onFitersCleared={() => {
                            setCategory('All')
                            setSelectedSortType('')
                            setIsOrderedAscendingly(true)
                            setPriceRange(500000)
                            setFilteredItems(items)
                        }}
                    />
                </div>
                <div className="flex flex-col gap-y-3 w-full h-[800px] overflow-x-scroll">
                    <div className="flex justify-between gap-y-2 flex-wrap">
                        <div className="w-full max-w-[150px] relative">
                            <div
                                className="w-full flex gap-x-1 justify-center items-center border-2 border-gray-200 rounded-md py-1 px-2"
                            >
                                <input
                                    className="w-[80%] border-none outline-none"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => SetSearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowUp') {
                                            if (activeSuggestionIndex > -1) setActiveSuggestionIndex(prev => prev - 1)
                                        } else if (e.key === 'ArrowDown') {
                                            if (currentUser) {
                                                if (activeSuggestionIndex < suggestions.length - 1)
                                                    setActiveSuggestionIndex(prev => prev + 1)
                                                else if (activeSuggestionIndex === suggestions.length - 1)
                                                    setActiveSuggestionIndex(-1)
                                            }
                                        }
                                        else if (e.key === 'Enter') {
                                            if (currentUser) {
                                                if (activeSuggestionIndex > -1 && activeSuggestionIndex < suggestions.length) {
                                                    SetSearchText(suggestions[activeSuggestionIndex])
                                                    setSearchedVal(suggestions[activeSuggestionIndex])
                                                    searchBarRef.current.blur()
                                                    setIsSearching(true)
                                                }
                                                else if (searchText) {
                                                    setSearchedVal(searchText)
                                                    searchBarRef.current.blur()
                                                    setIsSearching(true)
                                                }
                                            }
                                            else if (searchText) {
                                                setSearchedVal(searchText)
                                                searchBarRef.current.blur()
                                                setIsSearching(true)
                                            }
                                        }
                                    }}
                                    onFocus={() => setIsSearchBarFocused(true)}
                                    onBlur={() => setIsSearchBarFocused(false)}
                                    type="text"
                                    name=""
                                    id=""
                                    ref={searchBarRef}
                                />
                                {isSearching ? (<Loader />) : (<CiSearch />)}
                            </div>
                            <div className={`absolute w-full border-t-[1px] text-sm p-1 rounded-b-md shadow-md z-[98] 
                            bg-white ${isSearchBarFocused ? 'hidden' : 'hidden'} inline-block`}
                            >
                                <h4>{
                                    currentUser && currentUser.searchHistory.length ? 'Suggestions' : 'No Suggestions'
                                }</h4>
                                <div
                                    className="w-full flex flex-col gap-x-1"
                                    onMouseEnter={() => setActiveSuggestionIndex(-1)}
                                >
                                    {
                                        suggestions.map((suggestion, index) =>
                                            <button
                                                className={
                                                    `w-full rounded-md py-1 hover:bg-gray-100 text-left px-1 
                                                text-gray-500 ${activeSuggestionIndex === index ? 'bg-gray-100' : ''}`
                                                }
                                                onClick={() => {
                                                    console.log('clicked')
                                                    setSearchedVal(suggestion)
                                                    SetSearchText(suggestion)
                                                    searchBarRef.current.blur()
                                                    setIsSearching(true)
                                                }}
                                                key={suggestion}
                                            >
                                                {suggestion}
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-x-2 items-center h-fit">
                            <div className="sm:hidden">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <ShadCnButton variant="outline">Add Filter</ShadCnButton>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add Filter</DialogTitle>
                                            <DialogDescription>
                                                Filters help you finding easily the item you are looking for.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <FilterBox
                                            category={category}
                                            setCategory={setCategory}
                                            sortTypes={[
                                                {
                                                    value: 'byName',
                                                    label: 'By Name'
                                                },
                                                {
                                                    value: 'byPrice',
                                                    label: 'By Price'
                                                }
                                            ]}
                                            selectedSortType={selectedSortType}
                                            setSelectedSortType={setSelectedSortType}
                                            isOrderedAssccendingly={isOrderedAscendingly}
                                            setIsOrderedAscendingly={setIsOrderedAscendingly}
                                            priceRange={priceRange}
                                            setPriceRange={setPriceRange}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="hidden sm:flex gap-x-1 ">
                                <button
                                    className={`p-1 bg-gray-300 rounded-md ${orderOfItems === 'Grid' ? 'text-black' : 'text-white'} h-fit`}
                                    onClick={() => setOrderOfItems('Grid')}
                                >
                                    <IoGrid />
                                </button>
                                <button
                                    className={`p-1 bg-gray-300 rounded-md ${orderOfItems === 'List' ? 'text-black' : 'text-white'} h-fit`}
                                    onClick={() => setOrderOfItems('List')}
                                >
                                    <HiViewList />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`flex ${orderOfItems==='List'?'flex-col':''} gap-x-2 gap-y-2 flex-wrap`}>
                        {
                            isAppLoading ? (
                                <Loader/>
                            ) : filteredItems.length ? (
                                filteredItems.map(item =>
                                    { return orderOfItems==='Grid'?
                                            <DisplayCart key={item.$id} item={item}/>
                                        :<HorizontalDisplayCart key={item.$id} item={item}/>
                                }
                                )
                            ) : (<p>No items found</p>)
                        }
                    </div>
                </div>
            </div>
        </div>
    </Container>)
}