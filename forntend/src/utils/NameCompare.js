export default function nameCompare(a,b){
    const alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    let alphabetValue=1
    const alphabetToValue=new Map()
    for (const alphabet of alphabets) {
        alphabetToValue.set(alphabet,alphabetValue)
        alphabetValue++
    }
    const longestStrLen=a.length>b.length?a.length:b.length
    for(let i=0;i<longestStrLen;i++){
        if(a.charAt(i)&&b.charAt(i)){
            const aChar=a.charAt(i)
            const bChar=b.charAt(i)
            if(aChar!==bChar) {
                console.log(alphabetToValue.get(aChar.toLowerCase())-alphabetToValue.get(bChar.toLowerCase()))
                return alphabetToValue.get(aChar.toLowerCase())-alphabetToValue.get(bChar.toLowerCase())
            }
        }
    }
    console.log(a.length-b.length)
    return a.length-b.length
}