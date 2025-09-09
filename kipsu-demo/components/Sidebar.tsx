
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, label }: { href:string; label:string }) => {
  const path = usePathname();
  const active = path === href;
  return <Link className={` ${active ? 'navlink active' : ''}`} href={href}>
    <span className="badge">{label}</span>
  </Link>;
}

export function Sidebar(){
  const path = usePathname();
  const link = (href:string, text:string) => (
    <Link
      className={` ${path===href? 'active':''}`}
      href={href}
    >{text}</Link>
  );

  return (
    <aside className="sidebar">
      <div className="brand">🏢 Lake Drive Lofts</div>
      <nav className="nav">
        {link('/', 'Shared Inbox')}
        {link('/outreach', 'Outreach / Broadcast')}
        {link('/automations', 'Automations / Journeys')}
        {link('/analytics', 'Analytics')}
        {link('/sms-sim', 'Web Chat → SMS & Simulator')}
        {link('/assets', 'Assets Library')}
        {link('/import', 'PMS Stubs (CSV/Webhook)')}
        {link('/readme', 'Demo Guide')}
      </nav>
    </aside>
  );
}
