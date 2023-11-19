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
            fill="currentColor"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M15 4.50301C15 3.16666 13.3843 2.4974 12.4393 3.44235L7.93934 7.94235H6.00905C4.86772 7.94235 3.69106 8.60679 3.3493 9.8474C3.12147 10.6745 3 11.5448 3 12.4423C3 13.3399 3.12147 14.2102 3.3493 15.0373C3.69106 16.2779 4.86772 16.9423 6.00905 16.9423H7.93934L12.4393 21.4424C13.3843 22.3873 15 21.718 15 20.3817V4.50301Z" />
            <path d="M17.4323 8.19973C17.7252 7.90683 18.2001 7.90683 18.493 8.19973C20.8361 10.5429 20.8361 14.3419 18.493 16.685C18.2001 16.9779 17.7252 16.9779 17.4323 16.685C17.1394 16.3921 17.1394 15.9172 17.4323 15.6243C19.1897 13.867 19.1897 11.0177 17.4323 9.26039C17.1394 8.96749 17.1394 8.49262 17.4323 8.19973Z" />
        </svg>
    );
}

export default forwardRef<
    SVGSVGElement,
    DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement>
>(SpeakerWaveMediumIcon);
