import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LuckDate Body Purification - Internal Deodorant Supplement',
  description: 'Neutralize body & breath odor naturally with LuckDate chlorophyll capsules. 100% natural, vegan, and FDA cleared.',
  alternates: { canonical: '/body_purification' },
}

export default function BodyPurificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="body-purification-page"
      style={{
        '--background': '0 0% 100%',
        '--foreground': '150 10% 15%',
        '--card': '0 0% 100%',
        '--card-foreground': '150 10% 15%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '150 10% 15%',
        '--primary': '168 55% 42%',
        '--primary-foreground': '0 0% 100%',
        '--secondary': '150 20% 96%',
        '--secondary-foreground': '150 10% 15%',
        '--muted': '150 10% 96%',
        '--muted-foreground': '150 5% 45%',
        '--accent': '168 60% 90%',
        '--accent-foreground': '168 55% 25%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '0 0% 100%',
        '--border': '150 10% 90%',
        '--input': '150 10% 90%',
        '--ring': '168 55% 42%',
        '--radius': '0.5rem',
        '--brand-dark': '150 40% 20%',
        '--brand-light': '168 40% 95%',
        '--brand-gold': '42 80% 55%',
        '--sidebar-background': '0 0% 98%',
        '--sidebar-foreground': '240 5.3% 26.1%',
        '--sidebar-primary': '240 5.9% 10%',
        '--sidebar-primary-foreground': '0 0% 98%',
        '--sidebar-accent': '240 4.8% 95.9%',
        '--sidebar-accent-foreground': '240 5.9% 10%',
        '--sidebar-border': '220 13% 91%',
        '--sidebar-ring': '217.2 91.2% 59.8%',
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
