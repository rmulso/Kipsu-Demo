
'use client';
import { useStore } from '../../lib/store';

export default function Automations(){
  const { automations, setAutomationActive } = useStore();
  return (
    <div className="card vstack">
      <h3>Journeys & Automations</h3>
      <table className="table">
        <thead><tr><th>Name</th><th>Trigger</th><th>Message</th><th>Active</th></tr></thead>
        <tbody>
          {automations.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td><span className="badge">{a.trigger}</span></td>
              <td>{a.body}</td>
              <td>
                <button onClick={()=>setAutomationActive(a.id, !a.active)} className="badge">
                  {a.active ? 'On' : 'Off'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note">Demo toggles only; no outside sending. Remember “Reply STOP to opt out”.</div>
    </div>
  );
}
