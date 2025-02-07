"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, LineChart, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleAppLaunch = () => {
    router.push('/defai')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8" />
              <span className="text-xl font-bold">Sentifolio</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500/10" onClick={handleAppLaunch}>
                Try Demo
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90" onClick={handleAppLaunch}>
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          We&apos;re{" "}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            revolutionizing
          </span>{" "}
          <br />
          DeFi liquidity management
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl mb-12">
          Sentifolio is an AI-driven liquidity rebalancer that autonomously adjusts DeFi liquidity pools based on
          real-time social sentiment and market data.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90" onClick={handleAppLaunch}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500/10">
            View Documentation
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-2xl border border-white/10">
            <div className="size-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">AI-Powered Analytics</h3>
            <p className="text-gray-400">
              Leverage advanced machine learning algorithms to analyze social sentiment and market data for optimal
              liquidity allocation.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-2xl border border-white/10">
            <div className="size-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Risk Mitigation</h3>
            <p className="text-gray-400">
              Minimize impermanent loss and maximize returns through intelligent portfolio rebalancing and risk
              management strategies.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-2xl border border-white/10">
            <div className="size-12 rounded-lg bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center mb-6">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Automated Execution</h3>
            <p className="text-gray-400">
              Set and forget with autonomous liquidity management that responds to market conditions in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Powered by{" "}
          <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
            Cookie DataSwarm
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          By integrating Cookie DataSwarm APIs with on-chain analytics, we provide unparalleled insights for DeFi
          liquidity optimization.
        </p>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-r from-pink-500/10 to-blue-500/10 p-12 rounded-2xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your DeFi strategy?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join the future of automated liquidity management and start maximizing your returns today.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90" onClick={handleAppLaunch}>
            Launch App
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bot className="h-6 w-6" />
              <span className="font-bold">Sentifolio</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
