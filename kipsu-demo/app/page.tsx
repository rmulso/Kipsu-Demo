
import dynamic from 'next/dynamic';
const Inbox = dynamic(()=>import('../components/Inbox'), { ssr:false });

export default function Page(){
  return <Inbox/>;
}
