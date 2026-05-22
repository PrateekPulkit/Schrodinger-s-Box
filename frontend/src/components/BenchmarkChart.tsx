import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

interface BenchmarkResult {
  combo_id: string;
  key_gen_ms_mean: number;
  encap_ms_mean: number;
  decap_ms_mean: number;
  public_key_size: number;
  security_level: number;
}

export function BenchmarkChart({ data }: { data: BenchmarkResult[] }) {
  if (!data || data.length === 0) return null;

  // We need to normalize data for a meaningful radar chart since units differ (ms, bytes, level)
  // Normalization logic: (val - min) / (max - min) * 100
  // For time/size, lower is better. For security, higher is better.
  const formatData = () => {
    return data.map(d => {
      return {
        subject: d.combo_id,
        "Lattice Speed": 100 - Math.min(100, d.key_gen_ms_mean), // dummy norm
        "Code-Based Speed": 100 - Math.min(100, d.encap_ms_mean),
        "Overall Latency": 100 - Math.min(100, d.decap_ms_mean * 2),
        "Size Economy": 100 - (d.public_key_size / 10000) * 100,
        "Security Level": (d.security_level / 5) * 100
      };
    });
  };

  // Radar chart expects data structured by axis (subject) containing fields for each combo.
  // We transpose it:
  const axes = ["Lattice Speed", "Code-Based Speed", "Overall Latency", "Size Economy", "Security Level"];
  const formatted = formatData();
  
  const radarData = axes.map(axis => {
    const row: any = { axis };
    formatted.forEach(f => {
      row[f.subject] = f[axis as keyof typeof f];
    });
    return row;
  });

  const colors = ['#00d4ff', '#00ff88', '#ff3366', '#f59e0b', '#8b5cf6'];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#8b9bb4', fontSize: 12, fontFamily: 'monospace' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#121a2f', borderColor: '#00d4ff', fontFamily: 'monospace' }} 
            itemStyle={{ color: '#e0e6ed' }} 
          />
          <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 12 }} />
          
          {data.map((d, i) => (
            <Radar 
              key={d.combo_id} 
              name={d.combo_id} 
              dataKey={d.combo_id} 
              stroke={colors[i%colors.length]} 
              fill={colors[i%colors.length]} 
              fillOpacity={0.3} 
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
