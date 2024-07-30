"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MinusCircle, PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"

export default function Onboarding() {
    const [feedbackChunks, setFeedbackChunks] = useState<string[]>(['']);
    const [selectedTouchpoints, setSelectedTouchpoints] = useState<string[]>([]);

    const handleAddChunk = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFeedbackChunks([...feedbackChunks, '']);
    };

    const handleRemoveChunk = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFeedbackChunks(feedbackChunks.filter((_, i) => i !== index));
    };

    const handleChunkChange = (index: number, value: string) => {
        const newChunks = [...feedbackChunks];
        newChunks[index] = value;
        setFeedbackChunks(newChunks);
    };

    const handleTouchpointToggle = (value: string) => {
        setSelectedTouchpoints((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const productDescription = formData.get('product-description');
        const segment = formData.get('customer-segment');
        const journeyStages = formData.getAll('journey-stages');
        const touchpoints = formData.getAll('touchpoints-and-channels');
        const feedbackData = feedbackChunks.join('\n');
        const behavioralData = formData.get('behavioral-data');
        const goal = formData.get('goal');
        const kpi = formData.get('kpi');

        // Modified prompt for easier parsing
        // const prompt = `
        // Based on the following information, create a customer journey flow in the following format:


        // example format :
        // graph TD;
        // A-->B;
        // A-->C;
        // B-->D;
        // C-->D;

        // have "graph TD;" at begninning of each response for it to work. 

    
        // Repeat this structure for each stage in the journey. Ensure that stages are connected logically.
    
        // Use this information:
        // Customer Segment: ${segment}
        // Journey Stages: ${journeyStages.join(', ')}
        // Touchpoints and Channels: ${touchpoints.join(', ')}
        // Feedback Data: ${feedbackData}
        // Behavioral Data: ${behavioralData}
        // Overall Goal: ${goal}
        // KPI: ${kpi}
    
        // Provide the output in the format shown so that it can be easily parsed into a flowchart


        // `;

        const prompt = `
        Based on the following information, create a customer journey flow in the following format:
        Stage: [Stage Name]
        - Action: [Action Description]
        - Touchpoint: [Touchpoint]
        - Goal: [Goal for this stage]
    
        Repeat this structure for each stage in the journey. Ensure that stages are connected logically.
    
        Use this information:
        Product Description: ${productDescription}
        Customer Segment: ${segment}
        Journey Stages: ${journeyStages.join(', ')}
        Touchpoints and Channels: ${touchpoints.join(', ')}
        Feedback Data (use this data specifically to tailor your flow very specific to whats said here) : ${feedbackData} 
        Behavioral Data: ${behavioralData}
        Overall Goal: ${goal}
        KPI: ${kpi}
    
        Provide the output in a format that can be easily parsed into a flowchart structure.
        `;

        console.log(prompt)

        try {
            const response = await fetch("/api/openai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: prompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const suggestion = data.choices[0].message.content;

            console.log(suggestion)
            // Parse the AI response into a Mermaid chart
            const mermaidChart = parseSuggestionToMermaid(suggestion);
            // const mermaidChart = suggestion;


            console.log(mermaidChart)
            // Store the Mermaid chart in sessionStorage
            sessionStorage.setItem('mermaidChart', mermaidChart);

            router.push('/map');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to parse the AI suggestion into a Mermaid chart
    function parseSuggestionToMermaid(suggestion: string): string {
        const lines = suggestion.split('\n');
        let mermaidChart = 'graph TD;\n';
        let currentStage = '';
        let stageCount = 0;

        for (const line of lines) {
            if (line.startsWith('Stage:')) {
                if (currentStage) {
                    mermaidChart += `${currentStage}-->Stage${stageCount};\n`;
                }
                currentStage = `Stage${stageCount}`;
                stageCount++;
                mermaidChart += `${currentStage}["${line.split(':')[1].trim()}"];\n`;
            } else if (line.startsWith('- Action:')) {
                const action = line.split(':')[1].trim();
                mermaidChart += `${currentStage}Action["${action}"];\n`;
                mermaidChart += `${currentStage}-->${currentStage}Action;\n`;
            } else if (line.startsWith('- Touchpoint:')) {
                const touchpoint = line.split(':')[1].trim();
                mermaidChart += `${currentStage}Touchpoint["${touchpoint}"];\n`;
                mermaidChart += `${currentStage}-->${currentStage}Touchpoint;\n`;
            } else if (line.startsWith('- Goal:')) {
                const goal = line.split(':')[1].trim();
                mermaidChart += `${currentStage}Goal["${goal}"];\n`;
                mermaidChart += `${currentStage}-->${currentStage}Goal;\n`;
            }
        }

        return mermaidChart;
    }

    return (
        <div className="dark flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-900 font-maxifont text-white space-y-4">
            <header className="w-full p-4 bg-zinc-800/50 backdrop-blur-sm border-b border-zinc-700 flex items-center justify-between space-y-4">
                <div className="flex items-center">
                    <Link href="/">
                        <Image src='/logo.png' alt="Maximap Logo" width={120} height={120} className='rounded-full shadow-md' />
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Maximap </h1>
                </div>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4 justify-to the very right">
                    </div>
                    <div className="hidden md:block space-x-4">
                    </div>
                </div>
            </header>
            <main className="container mx-auto flex-1 flex flex-col items-center justify-center text-center">
                <form onSubmit={handleSubmit}>
                    <Card className="w-full max-w-3xl">
                        <CardHeader>
                            <CardTitle>Customer Insights</CardTitle>
                            <CardDescription>Gather and analyze customer data to drive business decisions.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="product-description">Product Description</Label>
                                <Input id="product-description" name="product-description" placeholder="Enter product description" className="w-full" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="customer-segment">Customer Segment</Label>
                                <Select name="customer-segment">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer segment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="segment1">Segment 1 - Young Adults</SelectItem>
                                        <SelectItem value="segment2">Segment 2 - Professionals</SelectItem>
                                        <SelectItem value="segment3">Segment 3 - Retirees</SelectItem>
                                        <SelectItem value="segment4">Segment 4 - Students</SelectItem>
                                        <SelectItem value="segment5">Segment 5 - Entrepreneurs</SelectItem>
                                        <SelectItem value="segment6">Segment 6 - Families</SelectItem>
                                        <SelectItem value="segment7">Segment 7 - Freelancers</SelectItem>
                                        <SelectItem value="segment8">Segment 8 - Small Business Owners</SelectItem>
                                        <SelectItem value="segment9">Segment 9 - Corporate Employees</SelectItem>
                                        <SelectItem value="segment10">Segment 10 - Non-Profit Workers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="journey-stages">Journey Stages</Label>
                                <Select name="journey-stages">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select journey stages" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="awareness">Awareness</SelectItem>
                                        <SelectItem value="consideration">Consideration</SelectItem>
                                        <SelectItem value="purchase">Purchase</SelectItem>
                                        <SelectItem value="post-purchase">Post-Purchase</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Touchpoints and Channels</Label>
                                <ToggleGroup type="multiple" className="grid grid-cols-3 gap-1 text-sm m-4 border-zinc-100 border-4 p-2 rounded-xl">
                                    <ToggleGroupItem value="website-visit" className=' text-sm' onClick={() => handleTouchpointToggle('website-visit')}>Website Visit</ToggleGroupItem>
                                    <ToggleGroupItem value="email-interaction" className=' text-sm' onClick={() => handleTouchpointToggle('email-interaction')}>Email Interaction</ToggleGroupItem>
                                    <ToggleGroupItem value="social-media" className=' text-sm' onClick={() => handleTouchpointToggle('social-media')}>Social Media Engagement</ToggleGroupItem>
                                    <ToggleGroupItem value="phone-call" className=' text-sm' onClick={() => handleTouchpointToggle('phone-call')}>Phone Call</ToggleGroupItem>
                                    <ToggleGroupItem value="chat-support" className=' text-sm' onClick={() => handleTouchpointToggle('chat-support')}>Chat Support</ToggleGroupItem>
                                    <ToggleGroupItem value="webinar" className=' text-sm' onClick={() => handleTouchpointToggle('webinar')}>Webinar</ToggleGroupItem>
                                    <ToggleGroupItem value="app-usage" className=' text-sm' onClick={() => handleTouchpointToggle('app-usage')}>App Usage</ToggleGroupItem>
                                    <ToggleGroupItem value="video-call" className=' text-sm' onClick={() => handleTouchpointToggle('video-call')}>Video Call</ToggleGroupItem>
                                    <ToggleGroupItem value="Chatbot" className=' text-sm' onClick={() => handleTouchpointToggle('Chatbot')}>Chatbot</ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="grid gap-2">
                                <Label>Feedback Data</Label>
                                {feedbackChunks.map((chunk, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Textarea
                                            value={chunk}
                                            onChange={(e) => handleChunkChange(index, e.target.value)}
                                            rows={2}
                                            placeholder={`Enter feedback chunk ${index + 1}`}
                                        />
                                        <Button variant="ghost" onClick={(e) => handleRemoveChunk(index, e)}>
                                            <MinusCircle className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="ghost" onClick={handleAddChunk}>
                                    <PlusCircle className="w-5 h-5" /> Add Feedback Chunk
                                </Button>
                            </div>
                            <div className="grid gap-2">
                                <Label>Behavioral Data (Avg Customer Satisfaction)</Label>
                                <Slider name="behavioral-data" min={1} max={10} step={1} defaultValue={[5]} aria-label="Behavioral data" className="bg-secondary" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Goals and KPIs</Label>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="goal">Goal</Label>
                                        <Select name="goal">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a goal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="increase-sales">Increase Sales</SelectItem>
                                                <SelectItem value="improve-customer-satisfaction">Improve Customer Satisfaction</SelectItem>
                                                <SelectItem value="expand-market-reach">Expand Market Reach</SelectItem>
                                                <SelectItem value="enhance-product-quality">Enhance Product Quality</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="kpi">KPI</Label>
                                        <Select name="kpi">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a KPI" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="revenue-growth">Revenue Growth</SelectItem>
                                                <SelectItem value="customer-retention-rate">Customer Retention Rate</SelectItem>
                                                <SelectItem value="market-share">Market Share</SelectItem>
                                                <SelectItem value="product-defect-rate">Product Defect Rate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t border-zinc-700 p-4">
                            <Button variant="secondary" type='submit'>Generate</Button>
                        </CardFooter>
                    </Card>
                </form>
            </main>
        </div>
    )
}
