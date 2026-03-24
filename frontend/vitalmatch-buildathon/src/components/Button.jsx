function Button(props) {
    return <button className={`${props.colour} text-white cursor-pointer py-2 px-6 md:my-0 rounded-full text-xl md:ml-8 hover:bg-blue-700 duration-500`}>{props.children}</button>
}

export default Button;