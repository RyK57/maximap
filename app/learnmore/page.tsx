import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaVideo } from 'react-icons/fa';

const LearnMore: React.FC = () => {
    return (
        <div className="dark flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 font-maxifont text-white">
            <header className="w-full p-4 bg-zinc-800/50 backdrop-blur-sm border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/">
                        <Image src='/logo.png' alt="Maximap Logo" width={120} height={120} className='rounded-full shadow-md' />
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Maximap</h1>
                </div>
            </header>
            <main className="container mx-auto flex-1 flex flex-col items-center justify-center text-center">
                <Card className="w-full max-w-md bg-zinc-700 p-4 rounded-lg shadow-md">
                    <CardHeader>
                        <CardTitle>About Maximap</CardTitle>
                        <CardDescription>
                        Customer Journey Mapping Tool - the output visualization would be a dynamic, interactive flowchart that represents the various stages, touchpoints, and customer interactions throughout their journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Acknowledgements</h2>
                            <Link href="https://www.linkedin.com/in/rithvik-sabnekar-1971a3266/">
                                <Button variant="default" className="mt-2">
                                    <FaLinkedin className='mr-2' />
                                    Creator - Rithvik Sabnekar
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Watch Demo</h2>
                            <a href="https://drive.google.com/file/d/1A12mogNRMa2rwLly8Ie-t137ecp1uqHv/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
                                <Button variant="default" className="mt-2">
                                    <FaVideo className='mr-2' />
                                    Watch Demo
                                </Button>
                            </a>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Technologies Used</h2>
                            <div className="flex flex-wrap justify-center mt-2 space-x-2">
                                <Button variant="default">Next.js, Shadcn/ui</Button>
                                <Button variant="default">OpenAI GPT-3.5</Button>
                                <Link href="https://mermaid.js.org/">
                                    <Button variant="secondary" className="mt-4 bg-red-800">Mermaid.js</Button>
                                </Link>
                            </div>
                        </div>
                        <Link href="/">
                            <Button variant="secondary" className="mt-4">
                                Go Back Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default LearnMore;