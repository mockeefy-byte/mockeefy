import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

interface JitsiMeetingWrapperProps {
    meetingId: string;
    userName: string;
    userEmail?: string;
    onApiReady?: (api: any) => void;
    onReadyToClose?: () => void;
    height?: string;
    width?: string;
}

export const JitsiMeetingWrapper: React.FC<JitsiMeetingWrapperProps> = ({
    meetingId,
    userName,
    userEmail,
    onApiReady,
    onReadyToClose,
    height = '100%',
    width = '100%'
}) => {
    // Jitsi room names should be unique. Prepending a prefix can help if meetingId is simple.
    // Assuming meetingId is already a UUID or unique string from the backend.
    const roomName = `Mockeefy-${meetingId}`;

    return (
        <div style={{ height, width, display: 'flex', flexDirection: 'column' }}>
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    disableDeepLinking: true,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    // Hide some buttons to make it look more like a custom embedded tool if desired,
                    // but keeping defaults is safer for functionality.
                    // toolbarButtons: [
                    //    'camera', 'chat', 'closedcaptions', 'desktop', 'feedback', 'filmstrip',
                    //    'fullscreen', 'hangup', 'help', 'highlight', 'microphone', 'participants-pane',
                    //    'profile', 'raisehand', 'recording', 'security', 'select-background',
                    //    'settings', 'shareaudio', 'sharedvideo', 'shortcuts', 'stats', 'tileview',
                    //    'toggle-camera', 'videoquality', '__end'
                    // ]
                }}
                interfaceConfigOverwrite={{
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_BRAND_WATERMARK: false,
                    BRAND_WATERMARK_LINK: '',
                    DEFAULT_BACKGROUND: '#202124',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Me',
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                }}
                userInfo={{
                    displayName: userName,
                    email: userEmail || ""
                }}
                onApiReady={(externalApi) => {
                    // Hook directly into the API if we need to add listeners specifically
                    if (onApiReady) onApiReady(externalApi);
                }}
                onReadyToClose={onReadyToClose}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                    iframeRef.style.border = 'none';
                }}
            />
        </div>
    );
};
