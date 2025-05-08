import React from 'react'
import type UserSession from 'types/UserSession'

interface NameLabelProps {
    user: UserSession | null
}

const NameLabel: React.FC<NameLabelProps> = ({ user }) => {
    return (
        <div className='absolute right-[20px] top-[20px] bg-main-extraLight rounded-xl px-3 py-3 text-main-extraDark'>{user ? user.username : "GUEST"}</div>
    )
}

export default NameLabel