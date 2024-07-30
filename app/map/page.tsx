"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Mermaid from '@/components/mermaid';

export default function Map() {
    const [chart, setChart] = useState<string>('');

    useEffect(() => {
        const mermaidChart = sessionStorage.getItem("mermaidChart");
        if (mermaidChart) {
            setChart(mermaidChart);
        }
    }, []);

    return (
        <div className="dark flex flex-col min-h-screen bg-zinc-900 font-maxifont text-white">
            <header className="w-full p-4 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/">
                        <Image src='/logo.png' alt="Maximap Logo" width={120} height={120} className='rounded-full shadow-md' />
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Maximap</h1>
                </div>
            </header>
            <main className="container mx-auto flex-1 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Your Ideal Customer Flow</h2>
                <div className="min-h-screen flex items-center justify-center">
                    {chart ? (
                        <Mermaid chart={chart} name="customer_flow" />
                    ) : (
                        <p>Loading chart...</p>
                    )}
                </div>
            </main>
        </div>
    );
}