
'use client';
import { useState } from 'react';
import { useStore } from '../../lib/store';
import Link from 'next/link';

export default function SmsSim(){
  const { startThreadFromWebChat, sendMessage, threads } = useStore();
  const [name, setName] = useState('Prospect');
  const [phone, setPhone] = useState('+15555550123');
  const [msg, setMsg] = useState('Hi! Touring soon—can we text about parking?');
  const [threadId, setThreadId] = useState<string | null>(null);
  const active = threads.find(t => t.id === threadId);

  return (
    <div className="grid grid-2">
      <div className="card vstack">
        <h3>Web Chat → SMS Handoff (Mock)</h3>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Mobile number"/>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4}/>
        <button onClick={()=>{
          const id = startThreadFromWebChat(name, phone, msg);
          setThreadId(id);
        }}>Start Chat & Switch to SMS</button>
        {threadId && <div className="note">Thread created. Go reply in the <Link href="/">Shared Inbox</Link> or below.</div>}
      </div>
      <div className="card vstack">
        <h3>SMS Simulator</h3>
        {active ? (
          <>
            <div className="note">Reply here as staff (simulated SMS outbound).</div>
            <input placeholder="Type SMS…" id="smsdraft"/>
            <button onClick={()=>{
              const el = document.getElementById('smsdraft') as HTMLInputElement;
              if(!el?.value) return;
              sendMessage(active.id, el.value + " (Reply STOP to opt out)", 'sms', true);
              el.value='';
            }}>Send SMS</button>
          </>
        ) : <div>No thread selected yet.</div>}
      </div>
    </div>
  );
}
