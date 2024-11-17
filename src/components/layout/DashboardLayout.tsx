import { motion } from "framer-motion";
import { NavLink } from "@/components/ui/nav-link";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Award,
  Settings,
  Wallet,
  Menu,
  User,
  LogOut
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SyncIndicator } from "@/components/ui/sync-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItems = () => (
    <nav className="space-y-2">
      <NavLink href="/dashboard" icon={LayoutDashboard}>
        Dashboard
      </NavLink>
      <NavLink href="/investments" icon={TrendingUp}>
        Yatırımlar
      </NavLink>
      <NavLink href="/referrals" icon={Users}>
        Referanslar
      </NavLink>
      <NavLink href="/achievements" icon={Award}>
        Başarılar
      </NavLink>
      <NavLink href="/balance" icon={Wallet}>
        Bakiye
      </NavLink>
      <NavLink href="/profile" icon={User}>
        Profil
      </NavLink>
      <NavLink href="/settings" icon={Settings}>
        Ayarlar
      </NavLink>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden lg:block w-64 bg-card border-r"
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Tefaiz Dashboard</h1>
            <p className="text-sm text-muted-foreground">Çalışan Paneli</p>
          </div>
        </div>
        <div className="flex flex-col justify-between h-[calc(100vh-5rem)]">
          <div className="p-4">
            <NavItems />
          </div>
          
          {/* User Profile & Logout Section */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.name}</span>
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
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Ayarlar
                </DropdownMenuItem>
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
      </motion.div>

      {/* Mobile Header & Navigation */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-50 w-full h-16 bg-background/80 backdrop-blur-sm border-b lg:hidden">
          <div className="flex h-full items-center px-4 gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b">
                  <h1 className="text-xl font-bold">Tefaiz Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Çalışan Paneli</p>
                </div>
                <div className="flex flex-col justify-between h-[calc(100vh-5rem)]">
                  <div className="p-4">
                    <NavItems />
                  </div>
                  
                  {/* Mobile User Profile & Logout */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1">
              <h1 className="text-lg font-semibold">Tefaiz</h1>
            </div>

            {/* Mobile Header User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
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
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Ayarlar
                </DropdownMenuItem>
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
        </header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-auto"
        >
          <div className="container mx-auto py-4 px-4 lg:py-6 lg:px-8">
            <Outlet />
          </div>
        </motion.main>

        {/* Mobile Bottom Navigation - Only Icons */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <div className="grid grid-cols-6 gap-1 p-2">
            <NavLink 
              href="/dashboard" 
              icon={LayoutDashboard}
              className="flex flex-col items-center py-2 px-1"
              iconClassName="h-5 w-5"
            />
            <NavLink 
              href="/investments" 
              icon={TrendingUp}
              className="flex flex-col items-center py-2 px-1"
              iconClassName="h-5 w-5"
            />
            <NavLink 
              href="/referrals" 
              icon={Users}
              className="flex flex-col items-center py-2 px-1"
              iconClassName="h-5 w-5"
            />
            <NavLink 
              href="/balance" 
              icon={Wallet}
              className="flex flex-col items-center py-2 px-1"
              iconClassName="h-5 w-5"
            />
            <NavLink 
              href="/profile" 
              icon={User}
              className="flex flex-col items-center py-2 px-1"
              iconClassName="h-5 w-5"
            />
            <NavLink 
              href="/achievements" 
              icon={Award}
              className="flex flex-col items-center py-2 px-1"
              iconClassName="h-5 w-5"
            />
          </div>
        </nav>

        {/* Sync Indicator */}
        <SyncIndicator />
      </div>
    </div>
  );
}