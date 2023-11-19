import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";

import Hls from "hls.js";

type ActionDefinition = {
    key: string | null;
    icon: ReactNode | null;
    action: () => void;
};

type ActionRegistry = {
    [id: string]: ActionDefinition;
};

type RegisterAction = (id: string, action: ActionDefinition) => () => void;

const VideoPlayerContext = createContext<{
    videoRef: React.RefObject<HTMLVideoElement>;
    registerAction: RegisterAction;
    hls: Hls | null;
}>({
    videoRef: { current: null },
    registerAction: () => () => {},
    hls: null,
});

export const VideoPlayerProvider = VideoPlayerContext.Provider;

export function useVideoPlayer() {
    return useContext(VideoPlayerContext);
}

export function useActionRegistry(
    showAction: (id: string) => void
): [ActionRegistry, RegisterAction] {
    const [registry, setRegistry] = useState<ActionRegistry>({});

    const registerAction = useCallback(
        (id: string, action: ActionDefinition) => {
            if (Object.hasOwn(registry, id)) return showAction.bind(null, id);

            setRegistry((prev) => {
                prev[id] = action;
                return { ...prev };
            });

            return showAction.bind(null, id);
        },
        [registry, showAction]
    );

    return [registry, registerAction];
}
