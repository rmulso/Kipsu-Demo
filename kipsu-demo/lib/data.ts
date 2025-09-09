
export type Resident = {
  id: string;
  name: string;
  unit: string;
  phone: string;
  tags: string[]; // e.g., ['Dog Owner', '2BR', 'Floor-3']
  sentiment?: 'positive'|'neutral'|'negative';
};

export type Message = {
  id: string;
  residentId: string;
  direction: 'inbound'|'outbound';
  channel: 'web'|'sms'|'email'|'digital';
  body: string;
  ts: number;
  internalNote?: boolean;
};

export type Thread = {
  id: string;
  residentId: string;
  subject: string;
  status: 'open'|'pending'|'closed';
  messages: Message[];
};

export const ASSETS = [
  { id:'parking-map', name:'U‑Haul Parking Map', url:'/parking-map.png' },
  { id:'move-in-checklist', name:'Move-in Checklist', url:'/move-in-checklist.txt' },
];

export const RESIDENTS: Resident[] = [
  { id:'r1', name:'Ava Thompson', unit:'101', phone:'+15555550001', tags:['Dog Owner','1BR','Floor-1'], sentiment:'positive' },
  { id:'r2', name:'Jamal Carter', unit:'203', phone:'+15555550002', tags:['Cat Owner','2BR','Floor-2'], sentiment:'neutral' },
  { id:'r3', name:'Linh Nguyen', unit:'305', phone:'+15555550003', tags:['No Pets','Studio','Floor-3'], sentiment:'negative' },
  { id:'r4', name:'Marta Gomez', unit:'402', phone:'+15555550004', tags:['Dog Owner','2BR','Floor-4'], sentiment:'neutral' },
  { id:'r5', name:'Chen Li', unit:'506', phone:'+15555550005', tags:['No Pets','1BR','Floor-5'], sentiment:'positive' }
];

const now = Date.now();
export const THREADS: Thread[] = [
  {
    id:'t1', residentId:'r1', subject:'New Inquiry from Web Chat', status:'open',
    messages:[
      { id:'m1', residentId:'r1', direction:'inbound', channel:'web', body:'Hi! Where can a U‑Haul park during move‑in?', ts: now - 1000*60*60 },
      { id:'m2', residentId:'r1', direction:'outbound', channel:'web', body:'Welcome to Lake Drive Lofts! Do you want this chat to continue via text? Enter your phone to switch.', ts: now - 1000*60*55 }
    ]
  },
  {
    id:'t2', residentId:'r2', subject:'Leaking faucet in 203', status:'pending',
    messages:[
      { id:'m3', residentId:'r2', direction:'inbound', channel:'sms', body:'My kitchen faucet is dripping again.', ts: now - 1000*60*40 },
      { id:'m4', residentId:'r2', direction:'outbound', channel:'sms', body:'Thanks Jamal—ticket created, maint. ETA tomorrow 9–11am.', ts: now - 1000*60*35 },
      { id:'m5', residentId:'r2', direction:'outbound', channel:'sms', body:'(NOTE) Please prioritize—repeat issue.', ts: now - 1000*60*34, internalNote:true }
    ]
  },
  {
    id:'t3', residentId:'r3', subject:'Renewal window questions', status:'open',
    messages:[
      { id:'m6', residentId:'r3', direction:'inbound', channel:'sms', body:'When is my renewal window?', ts: now - 1000*60*20 },
      { id:'m7', residentId:'r3', direction:'outbound', channel:'sms', body:'Your renewal window opens Nov 1—happy to review options!', ts: now - 1000*60*18 }
    ]
  }
];

export const QUICK_REPLIES = [
  'Hi! Welcome to Lake Drive Lofts—how can we help today?',
  'Thanks for reaching out—we’re on it and will update you shortly.',
  'Maintenance has been scheduled for tomorrow 9–11am.',
  'Your renewal window opens next month; want to schedule a chat?',
  'Here’s the parking map for move‑in (attaching now).'
];

export type OutreachCampaign = {
  id: string;
  name: string;
  audienceTags: string[];
  body: string;
  sentCount: number;
  ts: number;
};

export type Automation = {
  id: string;
  name: string;
  trigger: 'move-in'|'day-14'|'day-90'|'delinquent';
  body: string;
  active: boolean;
};

export const DEFAULT_AUTOMATIONS: Automation[] = [
  { id:'a1', name:'Welcome (Day 0)', trigger:'move-in', body:'Welcome to Lake Drive Lofts! Reply STOP to opt out.', active:true },
  { id:'a2', name:'Check-in (Day 14)', trigger:'day-14', body:'How is your first two weeks going? Any feedback for us?', active:true },
  { id:'a3', name:'Renewal Nudge (Day 90)', trigger:'day-90', body:'Heads up—your renewal window is coming up. Want to review options?', active:true },
  { id:'a4', name:'Delinquency Reminder', trigger:'delinquent', body:'We noticed a balance due. Can we help set up a plan?', active:true }
];
