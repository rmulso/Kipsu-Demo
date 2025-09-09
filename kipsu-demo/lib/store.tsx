
'use client';
import { createContext, useContext, useMemo, useState } from 'react';
import type { Thread, Resident, OutreachCampaign, Automation, Message } from './data';
import { RESIDENTS, THREADS, DEFAULT_AUTOMATIONS, QUICK_REPLIES, ASSETS } from './data';

type Store = {
  residents: Resident[];
  threads: Thread[];
  quickReplies: string[];
  assets: { id:string; name:string; url:string }[];
  campaigns: OutreachCampaign[];
  automations: Automation[];
  sendMessage: (threadId:string, body:string, channel:'web'|'sms'|'email'|'digital', outbound?:boolean)=>void;
  addNote: (threadId:string, body:string)=>void;
  attachAsset: (threadId:string, assetId:string)=>void;
  startThreadFromWebChat: (name:string, phone:string, message:string)=>string;
  broadcast: (tags:string[], body:string)=>number;
  setAutomationActive: (id:string, active:boolean)=>void;
};

const Ctx = createContext<Store|null>(null);

function withLocalStorage<T>(key:string, initial:T): [T, (updater:(prev:T)=>T)=>void] {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  const initialValue = raw ? JSON.parse(raw) as T : initial;
  const [state, setState] = useState<T>(initialValue);
  const setPersisted = (updater:(prev:T)=>T) => {
    setState(prev => {
      const next = updater(prev);
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [state, setPersisted];
}

export function StoreProvider({ children }:{ children: React.ReactNode }){
  const [residents] = useState<Resident[]>(RESIDENTS);
  const [threads, setThreads] = withLocalStorage<Thread[]>('threads', THREADS);
  const [campaigns, setCampaigns] = withLocalStorage<OutreachCampaign[]>('campaigns', []);
  const [automations, setAutomations] = withLocalStorage<Automation[]>('automations', DEFAULT_AUTOMATIONS);

  const sendMessage = (threadId:string, body:string, channel:'web'|'sms'|'email'|'digital', outbound=true)=>{
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const msg: Message = {
        id: 'm'+Math.random().toString(36).slice(2,7),
        residentId: t.residentId,
        direction: outbound ? 'outbound' : 'inbound',
        channel,
        body,
        ts: Date.now()
      };
      const updated = { ...t, messages: [...t.messages, msg], status: 'open' as const };
      return updated;
    }));
  };

  const addNote = (threadId:string, body:string)=>{
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const msg: Message = {
        id: 'n'+Math.random().toString(36).slice(2,7),
        residentId: t.residentId,
        direction: 'outbound',
        channel: 'digital',
        body: '(NOTE) ' + body,
        ts: Date.now(),
        internalNote: true
      };
      return { ...t, messages:[...t.messages, msg]};
    }));
  };

  const attachAsset = (threadId:string, assetId:string)=>{
    const asset = ASSETS.find(a => a.id === assetId);
    if (!asset) return;
    sendMessage(threadId, `Attached: ${asset.name} ${asset.url}`, 'digital', true);
  };

  const startThreadFromWebChat = (name:string, phone:string, message:string)=>{
    // Create or find resident
    let res = residents.find(r => r.phone === phone);
    if (!res){
      res = { id:'r'+Math.random().toString(36).slice(2,6), name, phone, unit:'TBD', tags:['Prospect'] };
      residents.push(res);
    }
    const threadId = 't'+Math.random().toString(36).slice(2,6);
    const thread: Thread = {
      id: threadId,
      residentId: res.id,
      subject: 'Web Chat → SMS',
      status: 'open',
      messages: [
        { id:'m'+Math.random().toString(36).slice(2,6), residentId: res.id, direction:'inbound', channel:'web', body: message, ts: Date.now()-1000 },
        { id:'m'+Math.random().toString(36).slice(2,6), residentId: res.id, direction:'outbound', channel:'web', body: 'Thanks! We can continue over SMS at this number.', ts: Date.now() }
      ]
    };
    setThreads(prev => [thread, ...prev]);
    return threadId;
  };

  const broadcast = (tags:string[], body:string)=>{
    const matches = residents.filter(r => tags.every(t => r.tags.includes(t)));
    // For demo, just increment campaigns and push outbound to a new "broadcast" thread per resident
    matches.forEach(r => {
      const threadId = 't'+Math.random().toString(36).slice(2,6);
      const thread: Thread = {
        id: threadId,
        residentId: r.id,
        subject: 'Broadcast: '+ body.slice(0,24),
        status: 'open',
        messages: [
          { id:'m'+Math.random().toString(36).slice(2,6), residentId: r.id, direction:'outbound', channel:'sms', body, ts: Date.now() }
        ]
      };
      setThreads(prev => [thread, ...prev]);
    });
    setCampaigns(prev => [{ id:'c'+Date.now(), name:'Broadcast', audienceTags:tags, body, sentCount: matches.length, ts: Date.now() }, ...prev]);
    return matches.length;
  };

  const setAutomationActive = (id:string, active:boolean)=>{
    setAutomations(prev => prev.map(a => a.id===id?{...a, active}:a));
  };

  const value: Store = useMemo(()=> ({
    residents,
    threads,
    quickReplies: QUICK_REPLIES,
    assets: ASSETS,
    campaigns,
    automations,
    sendMessage,
    addNote,
    attachAsset,
    startThreadFromWebChat,
    broadcast,
    setAutomationActive
  }), [threads, campaigns, automations]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Store missing');
  return ctx;
};
