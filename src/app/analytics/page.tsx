'use client'
import React from 'react'
import Navbar from '../components/navbar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Analytics = () => {
    const dummyData = [
        { date: '1', price: 2 },
        { date: '2', price: 1.5 },
        { date: '3', price: 2.5 },
        { date: '4', price: 3 },
        { date: '5', price: 3.2 },
        { date: '6', price: 3.5 },
        { date: '7', price: 4 },
        { date: '8', price: 4.5 },
        { date: '9', price: 3.8 },
        { date: '10', price: 18 },
        { date: '11', price: 20 },
        { date: '12', price: 10 },
        { date: '13', price: 8 },
        { date: '14', price: 9 },
        { date: '15', price: 10 },
        { date: '16', price: 11 },
        { date: '17', price: 14 },
        { date: '18', price: 6 },
        { date: '19', price: 20 },
        { date: '20', price: 23 }
    ]

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar />
            <h1 className="text-4xl font-[Dosis] font-bold text-[#1c1c1c] text-center mt-10">Analitik</h1>
            <div className="w-[80%] h-[500px] mx-auto mt-10">
                <ResponsiveContainer>
                    <LineChart data={dummyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 30]} ticks={[0, 7.5, 15, 22.5, 30]} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#00bfff"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Analytics