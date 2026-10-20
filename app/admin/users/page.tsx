"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useAsync } from "@/components/admin/useAsync";
import { getSupabaseClient } from "@/lib/cms/supabase";

type TeamRow = { user_id: string; email: string; role: "admin" | "editor"; created_at: string };

export default function UsersPage() {
  const { mode, isAdmin, session } = useAdmin();
  const [team, setTeam] = useState<TeamRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const action = useAsync();
  const client = getSupabaseClient();

  async function reload() {
    if (!client) return;
    const { data, error } = await client.rpc("cms_team");
    if (!error) setTeam(data as TeamRow[]);
  }

  useEffect(() => {
    if (mode !== "supabase" || !isAdmin || !client) return;
    let active = true;
    client.rpc("cms_team").then(({ data, error }) => {
      if (active && !error) setTeam(data as TeamRow[]);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isAdmin]);

  async function grant(e: FormEvent) {
    e.preventDefault();
    if (!client) return;
    await action.run(async () => {
      const { error } = await client.rpc("cms_set_role", { p_email: email, p_role: role });
      if (error) throw new Error(error.message);
      setEmail("");
      await reload();
    }, `Access granted to ${email}.`);
  }

  async function remove(userId: string) {
    if (!client) return;
    if (!confirm("Remove this person's dashboard access?")) return;
    await action.run(async () => {
      const { error } = await client.rpc("cms_remove_member", { p_user: userId });
      if (error) throw new Error(error.message);
      await reload();
    }, "Access removed.");
  }

  return (
    <AdminShell>
      <h1 className="admin-title">Users &amp; access</h1>

      {mode === "local" && (
        <div className="banner banner--info">
          Team management needs the Supabase connection. In the local demo, you are the only user and have full access.
        </div>
      )}

      {mode === "supabase" && !isAdmin && <div className="banner banner--info">Only administrators can manage team access.</div>}

      {mode === "supabase" && isAdmin && (
        <>
          <div className="admin-card">
            <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Grant access</h2>
            <p className="admin-hint">
              The person must already have a Supabase account — invite them first from the Supabase dashboard
              (Authentication → Users → Invite user), then grant their role here.
            </p>
            {action.error && <div className="banner banner--error">{action.error}</div>}
            {action.success && <div className="banner banner--success">{action.success}</div>}
            <form onSubmit={grant} className="btn-row" style={{ marginTop: 0, alignItems: "flex-end" }}>
              <div className="field" style={{ margin: 0, flex: 1, minWidth: 200 }}>
                <label>
                  Email
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>
                  Role
                  <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "editor")}>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="btn btn--primary" disabled={action.pending}>
                Grant access
              </button>
            </form>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Since</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(team ?? []).map((member) => (
                <tr key={member.user_id}>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>{new Date(member.created_at).toLocaleDateString()}</td>
                  <td>
                    {member.user_id !== session?.user.id && (
                      <button type="button" className="btn btn--danger" onClick={() => remove(member.user_id)}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </AdminShell>
  );
}
