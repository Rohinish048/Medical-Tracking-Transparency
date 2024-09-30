"use client"

import Footer from "@/components/Footer"
import { MedicineDashboardJsx } from "@/components/medicine-dashboard"
import Navbar from "@/components/Navbar"
import { MagicCard } from "@/components/magicui/magic-card"
const page = () => {
  return (
    <div>
        {/* <Navbar /> */}
      <MagicCard
        className="cursor-pointer text-white bg-[#000000ed] border-0 w-full"
        gradientColor={"#ffffff54"}
      >

        <MedicineDashboardJsx />
      </MagicCard>
        <Footer />
    </div>
  )
}
export default page