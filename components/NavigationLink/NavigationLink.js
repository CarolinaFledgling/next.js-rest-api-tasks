import Link from 'next/link'
import React from 'react'

const NavigationLink = ({ href, text, router }) => {

    const isActive = router.asPath === (href === '/task1' ? "/" : href)

    return (
        <Link href={href === '/task1' ? '/' : href} passHref>
            <a href={href === '/task1' ? '/' : href} className={`${isActive && "nav_item_active"} nav_item`}>{text}</a>
        </Link>
    )
}

export default NavigationLink