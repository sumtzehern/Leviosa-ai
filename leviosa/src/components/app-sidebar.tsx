import { Calendar, File, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/toggle"

// Menu items.
const items = [
  {
    title: "Parse",
    url: "#",
    icon: File,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  }
]

export function AppSidebar({ children }: { children?: React.ReactNode }) {
    return (
      <Sidebar>
        <div className="flex flex-col h-full">
          {/* Top: Logo section */}
          <div className="p-4 flex items-center gap-2">
            <span className="text-xl font-bold">Leviosa</span>
          </div>
  
          {/* Divider line */}
          <div className="border-t border-gray-400" />
  
          {/* Middle: Main content */}
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarContent>
              {children}
              <SidebarGroup>
                <SidebarGroupLabel>Playgrounds</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </div>
  
          <div className="border-t border-gray-400 p-4 flex items-center justify-between">
            <button className="text-muted-foreground text-sm hover:underline">Sign out</button>
            <ModeToggle />
          </div>
        </div>
      </Sidebar>
    );
  }
  