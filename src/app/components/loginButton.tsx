import { IoLogIn } from 'react-icons/io5'

const LoginButton = () => {
    return (
        <div className="w-[206px] h-16 px-[22px] py-2.5 bg-[#22577a] rounded-[10px] shadow justify-center items-center gap-[30px] inline-flex">
            <div className="text-neutral-100 text-[38px] font-bold font-['Dosis']">Masuk</div>
            <IoLogIn size={100} color="white" />
        </div>
    )
}

export default LoginButton