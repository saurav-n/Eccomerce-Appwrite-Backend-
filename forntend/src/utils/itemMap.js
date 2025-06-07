export default function mapItemIdToItem(itemId,items){
    const [mappedItem]=items.filter(item=>item.$id===itemId)
    return mappedItem
}