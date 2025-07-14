import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { Coffee, Users, ShoppingBag, BarChart3, Settings, Package } from "lucide-react"

export default function Welcome() {
  const { auth } = usePage<SharedData>().props

  const adminFeatures = [
    {
      icon: ShoppingBag,
      title: "Manage Orders",
      description: "View and process customer orders in real-time",
      link: "/admin/orders",
    },
    {
      icon: Coffee,
      title: "Menu Management",
      description: "Add, edit, and organize your coffee menu items",
      link: "/admin/menu",
    },
    {
      icon: Users,
      title: "Customer Analytics",
      description: "Track customer preferences and behavior",
      link: "/admin/customers",
    },
    {
      icon: Package,
      title: "Inventory Control",
      description: "Monitor stock levels and manage supplies",
      link: "/admin/inventory",
    },
    {
      icon: BarChart3,
      title: "Sales Reports",
      description: "Analyze sales data and performance metrics",
      link: "/admin/reports",
    },
    {
      icon: Settings,
      title: "Store Settings",
      description: "Configure your coffee shop preferences",
      link: "/admin/settings",
    },
  ]

  return (
    <>
      <Head title="Coffee Shop Admin">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-amber-50 to-orange-100 p-6 text-amber-900 lg:justify-center lg:p-8 dark:from-amber-950 dark:to-orange-950 dark:text-amber-100">
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-6xl">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <span className="text-xl font-semibold text-amber-800 dark:text-amber-200">BrewMaster Admin</span>
            </div>
            <div className="flex items-center gap-4">
              {auth.user ? (
                <>
                  <span className="text-sm text-amber-700 dark:text-amber-300">Welcome, {auth.user.name}</span>
                  <Link
                    href="/dashboard"
                    className="inline-block rounded-lg border border-amber-300 bg-amber-100 px-5 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-block rounded-lg border border-transparent px-5 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-800"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow">
          <main className="flex w-full max-w-[335px] flex-col lg:max-w-6xl">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-amber-200 p-6 dark:bg-amber-800">
                  <Coffee className="h-16 w-16 text-amber-600 dark:text-amber-300" />
                </div>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-amber-900 dark:text-amber-100 lg:text-6xl">
                Welcome to BrewMaster
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-amber-700 dark:text-amber-300">
                Your comprehensive coffee shop management system. Streamline operations, track sales, and deliver
                exceptional customer experiences.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adminFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-amber-900/50 dark:shadow-amber-900/20"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-100 p-2 group-hover:bg-amber-200 dark:bg-amber-800 dark:group-hover:bg-amber-700">
                      <feature.icon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">{feature.title}</h3>
                  </div>
                  <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">{feature.description}</p>
                  <Link
                    href={feature.link}
                    className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                  >
                    Get Started →
                  </Link>
                </div>
              ))}
            </div>

            {/* Quick Start Section */}
            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-amber-900/50">
              <h2 className="mb-6 text-2xl font-bold text-amber-900 dark:text-amber-100">Quick Start Guide</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-amber-800 dark:bg-amber-700 dark:text-amber-200">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">Set up your menu</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Add your coffee varieties, pastries, and other items to get started
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-amber-800 dark:bg-amber-700 dark:text-amber-200">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">Configure your store</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Set up operating hours, payment methods, and store preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-amber-800 dark:bg-amber-700 dark:text-amber-200">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">Start taking orders</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Begin processing customer orders and tracking your sales
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/admin/setup"
                  className="inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Complete Setup
                </Link>
                <Link
                  href="/admin/help"
                  className="inline-block rounded-lg border border-amber-300 px-6 py-3 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-600 dark:text-amber-200 dark:hover:bg-amber-800"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
