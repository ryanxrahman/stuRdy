"use client";

import { 
    Radar, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    ResponsiveContainer 
} from 'recharts';

type MasteryData = {
    name: string;
    mastery: number;
}

export default function SubjectMasteryRadar({ data }: { data: MasteryData[] }) {
    if (data.length < 3) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic h-full">
                Add at least 3 subjects to unlock the Radar of Mastery!
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] min-h-75 flex items-center justify-center">
            <ResponsiveContainer width="99%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#374151" strokeOpacity={0.2} />
                    <PolarAngleAxis 
                        dataKey="name" 
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} 
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 'auto']} 
                        tick={false} 
                        axisLine={false} 
                    />
                    <Radar
                        name="Mastery"
                        dataKey="mastery"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fill="#8b5cf6"
                        fillOpacity={0.5}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
