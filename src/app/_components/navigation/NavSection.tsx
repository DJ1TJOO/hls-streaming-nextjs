import React from "react";

import NavButton from "./NavButton";

export default function NavSection({
    label,
    buttons,
}: {
    label: string;
    buttons: { icon: React.ReactNode; label: string; url: string }[];
}) {
    return (
        <div className="flex flex-col">
            <span className="mb-2 text-sm font-bold text-text">{label}</span>
            {buttons.map((button) => (
                <NavButton key={button.label} path={button.url}>
                    {button.icon} {button.label}
                </NavButton>
            ))}
        </div>
    );
}
