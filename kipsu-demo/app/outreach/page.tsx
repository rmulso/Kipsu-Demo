
'use client';
import { useState } from 'react';
import { useStore } from '../../lib/store';

export default function Outreach(){
  const { residents, campaigns, broadcast } = useStore();
  const allTags = Array.from(new Set(residents.flatMap(r=>r.tags)));
  const [selected, setSelected] = useState<string[]>([]);
  const [body, setBody] = useState('Community BBQ this Saturday 1–3pm by the dog run! Reply STOP to opt out.');
  const [lastSent, setLastSent] = useState<number|null>(null);

  const toggle = (t:string)=> setSelected(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);

  return (
    <div className="grid grid-2">
      <div className="card vstack">
        <h3>Build Audience</h3>
        <div className="hstack" style={{flexWrap:'wrap'}}>
          {allTags.map(t => (
            <button key={t} className="tag" onClick={()=>toggle(t)}>{selected.includes(t) ? '✓ ' : ''}{t}</button>
          ))}
        </div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={6}/>
        <button onClick={()=>{ const n = broadcast(selected, body); setLastSent(n); }}>Send Broadcast</button>
        {lastSent!==null && <div className="note">Sent to {lastSent} residents (demo only).</div>}
      </div>
      <div className="card vstack">
        <h3>Recent Campaigns</h3>
        <table className="table">
          <thead><tr><th>When</th><th>Audience Tags</th><th>Body</th><th>Sent</th></tr></thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id}>
                <td>{new Date(c.ts).toLocaleString()}</td>
                <td>{c.audienceTags.join(', ')}</td>
                <td>{c.body.slice(0,80)}{c.body.length>80?'…':''}</td>
                <td>{c.sentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
