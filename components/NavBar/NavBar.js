import React from 'react'

import { useRouter } from "next/router";
import NavigationLink from '../NavigationLink/NavigationLink';

const navigationRoutes = ['task1', 'task2', 'task3', 'task4']

export const NavBar = () => {
    const router = useRouter()
    // router verify the current route
    return (
        <nav className='nav_container'>
            {navigationRoutes.map((singleRoute) => {
                return (
                    <NavigationLink
                        key={singleRoute}
                        href={`/${singleRoute}`}
                        text={singleRoute}
                        router={router}

                    />
                )
            })}

        </nav>
    )
}
