import { useEffect, useState } from "react";
import api from "../services/api";

const leadColumns = ["new", "contacted", "qualified", "proposal", "won", "lost"];

const CRMPage = () => {
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", status: "lead" });
  const [leadForm, setLeadForm] = useState({ name: "", source: "", status: "new" });

  const loadData = async () => {
    const [clientRes, leadRes] = await Promise.all([api.get("/clients"), api.get("/leads")]);
    setClients(clientRes.data);
    setLeads(leadRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addClient = async (event) => {
    event.preventDefault();
    await api.post("/clients", clientForm);
    setClientForm({ name: "", email: "", phone: "", status: "lead" });
    loadData();
  };

  const addLead = async (event) => {
    event.preventDefault();
    await api.post("/leads", leadForm);
    setLeadForm({ name: "", source: "", status: "new" });
    loadData();
  };

  const deleteClient = async (id) => {
    await api.delete(`/clients/${id}`);
    loadData();
  };

  const updateLeadStatus = async (id, status) => {
    await api.put(`/leads/${id}`, { status });
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
            <div key={client._id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-slate-500">{client.email} | {client.status}</p>
                {client.needs_follow_up && (
                  <p className="text-xs text-amber-600">No contact in 3+ days, follow-up needed.</p>
                )}
              </div>
              <button className="rounded bg-red-500 px-2 py-1 text-sm text-white" onClick={() => deleteClient(client._id)}>Delete</button>
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
                  <div key={lead._id} className="rounded bg-white p-2 text-sm shadow">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.source || "No source"}</p>
                    <select
                      className="mt-2 w-full rounded border p-1 text-xs"
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
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
