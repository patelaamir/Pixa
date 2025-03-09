import useScreenSize from "../utils/screenSize";


const Header = () => {
    const screenSize = useScreenSize()
    
    return (
        <div className={`flex items-center space-x-2 font-semibold border-b py-3 text-xl ${screenSize.width < 640 ? 'px-5' : 'pl-5'} `}>
            <img src="/pixa.svg" className="size-7"/>
            <span>
                Pixa
            </span>
        </div>
    )
}

export default Header