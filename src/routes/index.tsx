import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Database, Zap, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-600 via-blue-500 to-red-500">
      {/* Header */}
      <div className="text-center py-12 px-4 border-b-4 border-yellow-300">
        <h1 className="text-6xl font-black text-white mb-2 drop-shadow-lg" style={{ textShadow: '3px 3px 0px #000' }}>
          POKÉMON
        </h1>
        <h2 className="text-4xl font-black text-yellow-300 mb-4 drop-shadow-lg" style={{ textShadow: '2px 2px 0px #000' }}>
          MEZASTAR ORGANIZER
        </h2>
        <p className="text-white text-lg max-w-2xl mx-auto drop-shadow-lg">
          Manage your Trainer IDs and Support Pokémon from the arcade game. Scan, store, and organize with ease.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <Link to="/v1">
            <Button 
              className="bg-yellow-300 hover:bg-yellow-400 text-black text-xl font-bold py-6 px-8 border-4 border-black shadow-lg transition-transform hover:scale-105"
            >
              <QrCode className="w-6 h-6 mr-2" />
              VIEW YOUR TRAINER IDs
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <Card className="bg-white border-4 border-black shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
            <CardHeader className="bg-linear-to-r from-blue-500 to-purple-500 border-b-4 border-black">
              <CardTitle className="text-white text-2xl font-black flex items-center gap-2">
                <Database className="w-6 h-6" />
                Store IDs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 font-semibold">
                Safely store your trainer IDs locally with aliases for easy organization.
              </p>
              <Link to="/v1" className="mt-4 inline-block">
                <Button variant="outline" className="border-2 border-black font-bold">
                  Manage IDs →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-white border-4 border-black shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
            <CardHeader className="bg-linear-to-r from-red-500 to-orange-500 border-b-4 border-black">
              <CardTitle className="text-white text-2xl font-black flex items-center gap-2">
                <QrCode className="w-6 h-6" />
                QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 font-semibold">
                Generate and display QR codes for your trainer IDs and support Pokémon.
              </p>
              <Link to="/v1" className="mt-4 inline-block">
                <Button variant="outline" className="border-2 border-black font-bold">
                  View QR Codes →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-white border-4 border-black shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
            <CardHeader className="bg-linear-to-r from-green-500 to-teal-500 border-b-4 border-black">
              <CardTitle className="text-white text-2xl font-black flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Support Pokémon
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 font-semibold">
                Browse and manage your support Pokémon with detailed type information and moves.
              </p>
              <Link to="/v1" className="mt-4 inline-block">
                <Button variant="outline" className="border-2 border-black font-bold">
                  View Pokémon →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="bg-white border-4 border-black shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
            <CardHeader className="bg-linear-to-r from-yellow-500 to-pink-500 border-b-4 border-black">
              <CardTitle className="text-white text-2xl font-black flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Quick Copy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 font-semibold">
                One-click copy your trainer IDs to share with friends or use at the arcade.
              </p>
              <Link to="/v1" className="mt-4 inline-block">
                <Button variant="outline" className="border-2 border-black font-bold">
                  Get Started →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-white py-8 px-4 bg-black/30 border-4 border-yellow-300 rounded-lg">
          <p className="text-lg font-bold drop-shadow-lg">
            Ready to organize your Mezastar collection?
          </p>
          <Link to="/v1" className="mt-4 inline-block">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white text-lg font-bold py-3 px-6 border-2 border-white"
            >
              START NOW
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="border-t-4 border-yellow-300 mt-12"></div>
    </div>
  )
}
