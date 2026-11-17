import { useEffect, useState, type ReactNode } from "react";
import { authedSuperuser, pb } from "./pb";
import { navigate } from "./router";
import { LoginPage } from "./LoginPage";
import { OverviewPage } from "./OverviewPage";
import { ServerPage } from "./ServerPage";
import { ToolsPage } from "./ToolsPage";

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return path;
}

export default function AdminRoot() {
  const path = usePath();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(authedSuperuser());

  useEffect(() => {
    let dead = false;
    const finish = (ok: boolean) => {
      if (dead) return;
      setAuthed(ok);
      setReady(true);
    };
    if (!pb.authStore.isValid || !pb.authStore.isSuperuser) {
      pb.authStore.clear();
      finish(false);
      return;
    }
    pb.collection("_superusers")
      .authRefresh()
      .then(() => finish(authedSuperuser()))
      .catch(() => {
        pb.authStore.clear();
        finish(false);
      });
    return () => {
      dead = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!authed && path !== "/admin/login") navigate("/admin/login");
    if (authed && path === "/admin/login") navigate("/admin");
  }, [ready, authed, path]);

  if (!ready) return <div className="min-h-[100dvh] bg-graphite" />;
  if (!authed) return <LoginPage onSuccess={() => setAuthed(true)} />;

  const page = path.startsWith("/admin/tools") ? (
    <ToolsPage />
  ) : path.startsWith("/admin/server") ? (
    <ServerPage />
  ) : (
    <OverviewPage />
  );

  return <AdminShell path={path}>{page}</AdminShell>;
}

function AdminShell({ path, children }: { path: string; children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-graphite text-ink">
      <header className="flex items-end justify-between gap-6 px-4 pt-6 md:px-8">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">Admin</p>
          <p className="mt-1 font-display text-2xl tracking-tight">Faraz host</p>
        </div>
        <button
          type="button"
          className="tactile rounded-full border border-line px-4 py-2 font-display text-sm"
          onClick={() => {
            pb.authStore.clear();
            navigate("/admin/login");
            window.location.assign("/admin/login");
          }}
        >
          Log out
        </button>
      </header>
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-8 md:grid-cols-12 md:px-8">
        <nav aria-label="Admin" className="flex gap-2 md:col-span-3 md:flex-col">
          <AdminLink href="/admin" current={path === "/admin"}>
            Overview
          </AdminLink>
          <AdminLink href="/admin/tools" current={path.startsWith("/admin/tools")}>
            Tools
          </AdminLink>
          <AdminLink href="/admin/server" current={path.startsWith("/admin/server")}>
            Server
          </AdminLink>
        </nav>
        <div className="md:col-span-9">{children}</div>
      </div>
    </div>
  );
}

function AdminLink({ href, current, children }: { href: string; current: boolean; children: string }) {
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={`rounded-full px-4 py-2 font-display text-sm ${current ? "bg-accent text-accent-ink" : "text-muted"}`}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
