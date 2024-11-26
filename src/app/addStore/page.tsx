import React from 'react'
import Navbar from '../components/navbar'

const AddStore = () => {
  return (
    <div className="w-[1440px] h-[1024px] relative bg-white">
        <Navbar />
        <div className="left-[84px] top-[155px] absolute text-center text-[#1c1c1c] text-4xl font-bold font-['Dosis']">Tambahkan Informasi Toko</div>
        <div className="px-2.5 py-[15px] left-[96px] top-[887px] absolute bg-[#1c1c1c] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-sm font-bold font-['Dosis']">Tambahkan Toko</div>
        </div>
        <div className="h-[519px] left-[96px] top-[279px] absolute flex-col justify-start items-start gap-10 inline-flex">
            <div className="w-[1128px] h-[38px] flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-start items-center gap-[51px] inline-flex">
                    <div className="w-28 text-black text-base font-medium font-['Dosis'] leading-tight">Nama Toko</div>
                    <div className="flex-col justify-start items-start gap-1.5 inline-flex">
                        <input className="w-[1000px] pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300 text-gray-600" placeholder="Enter value" />
                    </div>
                </div>
            </div>
            <div className="w-[1128px] h-[38px] flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-start items-center gap-[27px] inline-flex">
                    <div className="w-[136px] text-black text-base font-medium font-['Dosis'] leading-tight">Alamat</div>
                    <div className="flex-col justify-start items-start gap-1.5 inline-flex">
                        <input className="w-[1000px] pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300 text-gray-600" placeholder="Enter value" />
                    </div>
                </div>
            </div>
            <div className="w-[1128px] h-[38px] flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-start items-center gap-[27px] inline-flex">
                    <div className="w-[136px] text-black text-base font-medium font-['Dosis'] leading-tight">Kontak</div>
                    <div className="flex-col justify-start items-start gap-1.5 inline-flex">
                        <input className="w-[1000px] pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300 text-gray-600" placeholder="Enter value" />
                    </div>
                </div>
            </div>
            <div className="w-[1128px] h-[38px] flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-start items-center gap-[27px] inline-flex">
                    <div className="w-[136px] text-black text-base font-medium font-['Dosis'] leading-tight">Jam Buka</div>
                    <div className="flex-col justify-start items-start gap-1.5 inline-flex">
                        <input className="w-[1000px] pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300 text-gray-600" placeholder="Enter value" />
                    </div>
                </div>
            </div>
            <div className="w-[1128px] h-[38px] flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-start items-center gap-[27px] inline-flex">
                    <div className="w-[136px] text-black text-base font-medium font-['Dosis'] leading-tight">Foto</div>
                    <div className="px-2.5 py-[15px] bg-[#1c1c1c] justify-center items-center gap-2.5 flex">
                        <div className="text-center text-white text-sm font-bold font-['Dosis']">Upload</div>
                    </div>
                </div>
            </div>
            <div className="self-stretch justify-start items-start gap-1.5 inline-flex">
                <div className="justify-start items-start gap-2 flex">
                    <div className="w-[1155px] h-[129px] relative">
                        <div className="left-0 top-[7px] absolute text-black text-base font-medium font-['Dosis'] leading-[14px]">Deskripsi</div>
                        <div className="w-[997px] h-[129px] px-3 py-2 left-[158px] top-0 absolute bg-white rounded-md border border-slate-300 flex-col justify-start items-start gap-2.5 inline-flex">
                            <textarea className="w-full h-full bg-white border-nonetext-base font-medium font-['Dosis'] leading-[14px] text-gray-600" placeholder="Deskripsi"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddStore