
'use client';
import { useMemo } from 'react';
import { useStore } from '../../lib/store';

export default function Analytics(){
  const { threads, residents, campaigns } = useStore();
  const firstResponseMinutes = useMemo(()=>{
    // crude: measure gap between first inbound and first outbound per thread
    const diffs = threads.map(t => {
      const inbound = t.messages.find(m => m.direction==='inbound');
      const outbound = t.messages.find(m => m.direction==='outbound' && !m.internalNote);
      if(!inbound || !outbound) return 5;
      return Math.max(1, Math.round((outbound.ts - inbound.ts)/60000));
    });
    return Math.round(diffs.reduce((a,b)=>a+b,0)/Math.max(1,diffs.length));
  }, [threads]);

  const feedbackRate = Math.min(100, 40 + campaigns.length * 5); // demo heuristic
  const sentiment = useMemo(()=>{
    const total = residents.length;
    const pos = residents.filter(r=>r.sentiment==='positive').length;
    const neg = residents.filter(r=>r.sentiment==='negative').length;
    return { posPct: Math.round(pos/total*100), negPct: Math.round(neg/total*100) };
  }, [residents]);

  return (
    <div className="grid grid-3">
      <div className="card vstack">
        <div className="kpi">{firstResponseMinutes}m</div>
        <div className="kpi-label">Avg First Response</div>
      </div>
      <div className="card vstack">
        <div className="kpi">{feedbackRate}%</div>
        <div className="kpi-label">Feedback Response Rate</div>
      </div>
      <div className="card vstack">
        <div className="kpi">{sentiment.posPct}% / {sentiment.negPct}%</div>
        <div className="kpi-label">Sentiment (pos / neg)</div>
      </div>
    </div>
  );
}
