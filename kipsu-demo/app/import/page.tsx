
'use client';
import { useState } from 'react';
import { useStore } from '../../lib/store';

export default function ImportStubs(){
  const [csv, setCsv] = useState('name,unit,phone,tags\nAlex Lee,701,+15555551000,"Dog Owner, 1BR"');
  const [webhook, setWebhook] = useState('{ "event":"unit_updated","unit":"701","new_status":"Occupied" }');
  const { residents } = useStore();

  return (
    <div className="grid grid-2">
      <div className="card vstack">
        <h3>CSV Ingest (Mock)</h3>
        <textarea value={csv} onChange={e=>setCsv(e.target.value)} rows={8}/>
        <button onClick={()=>alert('CSV processed (demo only).')}>Process CSV</button>
        <div className="note">In a real build, this would push to the resident directory.</div>
      </div>
      <div className="card vstack">
        <h3>Webhook Receiver (Mock)</h3>
        <textarea value={webhook} onChange={e=>setWebhook(e.target.value)} rows={8}/>
        <button onClick={()=>alert('Webhook accepted (demo only).')}>Send Test Webhook</button>
        <div className="note">Pretends to accept PMS events (e.g., Yardi-style).</div>
      </div>
    </div>
  );
}
