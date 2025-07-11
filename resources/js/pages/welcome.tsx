"use client"

import type React from "react"

import { FormEventHandler, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, LoaderCircle, Shield, User } from "lucide-react"
import { useForm } from "@inertiajs/react"
import InputError from "@/components/input-error"

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

// interface LoginProps {
//     status?: string;
//     canResetPassword: boolean;
// }
export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

   const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-600 mt-2">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={data.email}
                    onChange={(e) => setData('email',e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                  <InputError message={errors.email} />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) => setData('password',e.target.value)}
                    className="pr-10 h-11"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                <InputError message={errors.password} />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={() => setData('remember', !data.remember) }
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="px-0 text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Button>
              </div>

              {/* Sign In Button */}
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" tabIndex={4} disabled={processing}>
                 {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Sign In to Dashboard
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-xs text-slate-500">Protected by enterprise-grade security</p>
                <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-slate-400">
                  <span>• SSL Encrypted</span>
                  <span>• 2FA Ready</span>
                  <span>• Audit Logged</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            Need help? Contact{" "}
            <Button variant="link" className="px-0 text-xs text-blue-600 hover:text-blue-800">
              IT Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
