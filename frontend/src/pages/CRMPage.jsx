import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createRecord,
  deleteRecord,
  listRecords,
  toJsDate,
  updateRecord,
} from "../services/firestoreService";

const leadColumns = ["new", "contacted", "qualified", "proposal", "won", "lost"];

const CRMPage = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", status: "lead" });
  const [leadForm, setLeadForm] = useState({ name: "", source: "", status: "new" });

  const loadData = async () => {
    if (!user?.id) return;
    const [clientsData, leadsData] = await Promise.all([
      listRecords("clients", user.id),
      listRecords("leads", user.id),
    ]);
    const now = new Date();
    const formattedClients = clientsData.map((client) => {
      const lastContact = toJsDate(client.last_contact_date);
      const daysSinceContact = Math.floor(
        (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { ...client, needs_follow_up: daysSinceContact > 3 };
    });
    setClients(formattedClients);
    setLeads(leadsData);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const addClient = async (event) => {
    event.preventDefault();
    await createRecord(
      "clients",
      { ...clientForm, last_contact_date: new Date().toISOString() },
      user.id
    );
    setClientForm({ name: "", email: "", phone: "", status: "lead" });
    loadData();
  };

  const addLead = async (event) => {
    event.preventDefault();
    const leadId = await createRecord("leads", leadForm, user.id);
    // Automation: create follow-up task whenever a new lead is created.
    await createRecord(
      "tasks",
      {
        title: `Follow up with lead: ${leadForm.name}`,
        description: "Automated follow-up created from new lead.",
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "todo",
        related_lead: leadId,
      },
      user.id
    );
    setLeadForm({ name: "", source: "", status: "new" });
    loadData();
  };

  const deleteClient = async (id) => {
    await deleteRecord("clients", id);
    loadData();
  };

  const updateLeadStatus = async (id, status) => {
    await updateRecord("leads", id, { status });
    loadData();
  };

  const updateClientStatus = async (client, newStatus) => {
    const previousStatus = client.status;
    await updateRecord("clients", client.id, { status: newStatus });
    if (previousStatus !== newStatus) {
      await createRecord(
        "activityLogs",
        {
          clientId: client.id,
          action: "CLIENT_STATUS_CHANGED",
          details: `Status changed from ${previousStatus} to ${newStatus}`,
        },
        user.id
      );
    }
    loadData();
  };

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold">CRM - Clients and Leads</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addClient} className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Add Client</h3>
          <div className="grid gap-2">
            <input className="rounded border p-2" placeholder="Name" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} required />
            <input className="rounded border p-2" placeholder="Email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} />
            <input className="rounded border p-2" placeholder="Phone" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} />
            <select className="rounded border p-2" value={clientForm.status} onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
            <button className="rounded bg-indigo-600 px-3 py-2 text-white">Save Client</button>
          </div>
        </form>

        <form onSubmit={addLead} className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Add Lead</h3>
          <div className="grid gap-2">
            <input className="rounded border p-2" placeholder="Lead Name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
            <input className="rounded border p-2" placeholder="Source" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} />
            <select className="rounded border p-2" value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}>
              {leadColumns.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="rounded bg-slate-900 px-3 py-2 text-white">Save Lead</button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">Client List</h3>
        <div className="space-y-2">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-slate-500">{client.email} | {client.status}</p>
                {client.needs_follow_up && (
                  <p className="text-xs text-amber-600">No contact in 3+ days, follow-up needed.</p>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  className="rounded border p-1 text-xs"
                  value={client.status}
                  onChange={(e) => updateClientStatus(client, e.target.value)}
                >
                  <option value="lead">lead</option>
                  <option value="active">active</option>
                  <option value="closed">closed</option>
                </select>
                <button
                  className="rounded bg-red-500 px-2 py-1 text-sm text-white"
                  onClick={() => deleteClient(client.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">Lead Pipeline (Kanban)</h3>
        <div className="grid gap-3 overflow-x-auto md:grid-cols-3 xl:grid-cols-6">
          {leadColumns.map((column) => (
            <div key={column} className="rounded border bg-slate-50 p-2">
              <h4 className="mb-2 text-sm font-semibold uppercase">{column}</h4>
              <div className="space-y-2">
                {leads.filter((lead) => lead.status === column).map((lead) => (
                  <div key={lead.id} className="rounded bg-white p-2 text-sm shadow">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.source || "No source"}</p>
                    <select
                      className="mt-2 w-full rounded border p-1 text-xs"
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    >
                      {leadColumns.map((status) => (
                        <option key={status} value={status}>
                          Move to {status}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CRMPage;
