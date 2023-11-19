import React, {
    DetailedHTMLProps,
    ForwardedRef,
    HTMLAttributes,
    forwardRef,
} from "react";

function SpeakerWaveMediumIcon(
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
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M18.2126 7.97856C20.2629 10.0288 20.2629 13.3529 18.2126 15.4032M8.5 7.94084L13.2197 3.22117C13.6921 2.7487 14.5 3.08333 14.5 3.7515V19.6302C14.5 20.2984 13.6921 20.633 13.2197 20.1605L8.5 15.4408H6.25905C5.37971 15.4408 4.5559 14.9344 4.32237 14.0866C4.11224 13.3238 4 12.5204 4 11.6908C4 10.8613 4.11224 10.0579 4.32237 9.29508C4.5559 8.44732 5.37971 7.94084 6.25905 7.94084H8.5Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

export default forwardRef<
    SVGSVGElement,
    DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement>
>(SpeakerWaveMediumIcon);
