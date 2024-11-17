import { motion } from "framer-motion";
import { NavLink } from "@/components/ui/nav-link";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  TrendingUp,
  LogOut,
  Bell,
  UserPlus,
  Wallet
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-card border-r"
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              A
            </div>
            <div>
              <h1 className="font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Sistem Yönetimi</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink href="/admin" icon={LayoutDashboard}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/investments" icon={TrendingUp}>
            Yatırım Yönetimi
          </NavLink>
          <NavLink href="/admin/referrals" icon={UserPlus}>
            Referans Yönetimi
          </NavLink>
          <NavLink href="/admin/users" icon={Users}>
            Kullanıcı Yönetimi
          </NavLink>
          <NavLink href="/admin/balances" icon={Wallet}>
            Bakiye Yönetimi
          </NavLink>
          <NavLink href="/admin/settings" icon={Settings}>
            Sistem Ayarları
          </NavLink>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
          <h2 className="font-semibold">Yönetim Paneli</h2>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profil Ayarları</DropdownMenuItem>
                <DropdownMenuItem>Sistem Ayarları</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}