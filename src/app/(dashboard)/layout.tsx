import { Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Topbar */}
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-border px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-foreground">
          <div className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            D
          </div>
          <span className="font-semibold text-sm">DevStash</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8 h-7 text-sm bg-muted/50 border-border"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1 rounded">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FolderPlus className="size-3.5" />
            New Collection
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            New Item
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-border bg-sidebar overflow-y-auto p-4">
          <h2 className="text-muted-foreground text-sm font-medium">Sidebar</h2>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
