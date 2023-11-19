import React, {
    DetailedHTMLProps,
    ForwardedRef,
    HTMLAttributes,
    forwardRef,
} from "react";

function ExitFullScreenIcon(
    props: DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement>,
    svgRef: ForwardedRef<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            ref={svgRef}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18 15C16.3431 15 15 16.3431 15 18V19.5C15 19.9142 15.3358 20.25 15.75 20.25C16.1642 20.25 16.5 19.9142 16.5 19.5V18C16.5 17.1716 17.1716 16.5 18 16.5H19.5C19.9142 16.5 20.25 16.1642 20.25 15.75C20.25 15.3358 19.9142 15 19.5 15H18Z" />
            <path d="M4.5 15C4.08579 15 3.75 15.3358 3.75 15.75C3.75 16.1642 4.08579 16.5 4.5 16.5H6C6.82843 16.5 7.5 17.1716 7.5 18V19.5C7.5 19.9142 7.83579 20.25 8.25 20.25C8.66421 20.25 9 19.9142 9 19.5V18C9 16.3431 7.65685 15 6 15H4.5Z" />
            <path d="M16.5 4.5C16.5 4.08579 16.1642 3.75 15.75 3.75C15.3358 3.75 15 4.08579 15 4.5V6C15 7.65685 16.3431 9 18 9H19.5C19.9142 9 20.25 8.66421 20.25 8.25C20.25 7.83579 19.9142 7.5 19.5 7.5H18C17.1716 7.5 16.5 6.82843 16.5 6V4.5Z" />
            <path d="M9 4.5C9 4.08579 8.66421 3.75 8.25 3.75C7.83579 3.75 7.5 4.08579 7.5 4.5V6C7.5 6.82843 6.82843 7.5 6 7.5H4.5C4.08579 7.5 3.75 7.83579 3.75 8.25C3.75 8.66421 4.08579 9 4.5 9H6C7.65685 9 9 7.65685 9 6V4.5Z" />
            <path
                d="M10 9C9.44772 9 9 9.44772 9 10V14C9 14.5523 9.44772 15 10 15H14C14.5523 15 15 14.5523 15 14V10C15 9.44772 14.5523 9 14 9H10Z"
                stroke="none"
            />
        </svg>
    );
}

export default forwardRef<
    SVGSVGElement,
    DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement>
>(ExitFullScreenIcon);
