
'use client';
import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { fmtTime } from '../lib/util';

export default function Inbox(){
  const { threads, residents, quickReplies, sendMessage, addNote, attachAsset } = useStore();
  const [activeId, setActiveId] = useState(threads[0]?.id);
  const active = useMemo(()=> threads.find(t => t.id === activeId), [threads, activeId]);
  const resident = residents.find(r => r.id === active?.residentId);
  const [draft, setDraft] = useState('');

  return (
    <div className="grid grid-2">
      <div className="card vstack">
        <div className="hstack" style={{justifyContent:'space-between'}}>
          <h3>Shared Inbox</h3>
          <span className="badge">{threads.length} threads</span>
        </div>
        <div className="vstack">
          {threads.map(t => {
            const r = residents.find(x => x.id === t.residentId);
            return (
              <div key={t.id} className="thread" onClick={()=>setActiveId(t.id)}>
                <h4>{t.subject}</h4>
                <small>{r?.name} • Unit {r?.unit} • {t.status.toUpperCase()}</small><br/>
                <small>Last: {fmtTime(t.messages.at(-1)!.ts)}</small>
              </div>
            )
          })}
        </div>
      </div>
      <div className="card vstack">
        {active && resident ? (
          <>
            <div className="hstack" style={{justifyContent:'space-between'}}>
              <h3>{resident.name} • Unit {resident.unit}</h3>
              <div className="hstack">
                {resident.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
              </div>
            </div>
            <div className="vstack" style={{minHeight:280}}>
              {active.messages.map(m => (
                <div key={m.id} className={`msg ${m.internalNote ? '' : (m.direction==='outbound'?'user':'resident')}`}>
                  <small style={{color:'#9ab'}}>{m.channel.toUpperCase()} • {fmtTime(m.ts)}</small><br/>
                  <div>{m.body}</div>
                </div>
              ))}
            </div>
            <div className="hstack">
              <input
                style={{flex:1}}
                placeholder="Type a reply…"
                value={draft}
                onChange={e=>setDraft(e.target.value)}
              />
              <button onClick={()=>{ if(!draft) return; sendMessage(active.id, draft, 'sms', true); setDraft(''); }}>Send</button>
            </div>
            <div className="hstack" style={{flexWrap:'wrap'}}>
              {quickReplies.map(q => <button key={q} onClick={()=>sendMessage(active.id, q, 'sms', true)} className="badge">{q}</button>)}
            </div>
            <div className="grid grid-3">
              <div className="vstack">
                <h4>Private Notes</h4>
                <textarea placeholder="Add a note for the team…" id="note" />
                <button onClick={()=>{
                  const el = document.getElementById('note') as HTMLTextAreaElement;
                  if(el?.value) { addNote(active.id, el.value); el.value=''; }
                }}>Add Note</button>
              </div>
              <div className="vstack">
                <h4>Attach Asset</h4>
                <button onClick={()=>attachAsset(active.id,'parking-map')}>Attach Parking Map</button>
                <button onClick={()=>attachAsset(active.id,'move-in-checklist')}>Attach Move-in Checklist</button>
              </div>
              <div className="vstack">
                <h4>Status</h4>
                <div className="note">Threads auto-close when inactive (demo).</div>
              </div>
            </div>
          </>
        ) : <div>Select a thread</div>}
      </div>
    </div>
  );
}
