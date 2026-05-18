'use client'

import Image from 'next/image'
import Link from 'next/link'
import posthog from 'posthog-js'


const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                    <p> DevEvent</p>
                </Link>

                <ul>
                    <Link href="/" onClick={() => posthog.capture('nav_link_clicked', { label: 'Home' })}>Home</Link>
                    <Link href="/" onClick={() => posthog.capture('nav_link_clicked', { label: 'Events' })}>Events</Link>
                    <Link href="/" onClick={() => posthog.capture('nav_link_clicked', { label: 'Create Events' })}>Create Events</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
