import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { PageProps, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgeDollarSign, BookOpen, Coffee, Folder, LayoutGrid, Package, ShoppingBag } from 'lucide-react';
import AppLogo from './app-logo';



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/products',
        icon: Coffee,
    },
    {
        title: 'Ingredients',
        href: '/ingredients',
        icon: Package,
    },
    {
        title: 'Cashier',
        href: '/cashier',
        icon: ShoppingBag,
    },
    {
        title: 'transactions',
        href: '/transactions',
        icon: BadgeDollarSign,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
     const { auth } = usePage<PageProps>().props;
    const role = auth?.user?.role;

    const filteredMainNavItems = mainNavItems.filter((item) => {
        if (role === 'cashier') {
            // hanya boleh lihat Dashboard dan Cashier
            return ['/dashboard', '/cashier'].includes(item.href);
        }
        return true; // role lainnya bisa lihat semua
    });
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
