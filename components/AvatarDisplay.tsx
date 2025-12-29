'use client';

interface AvatarConfig {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    eyeType: string;
    mouthType: string;
    clothingColor: string;
}

interface AvatarDisplayProps {
    config: AvatarConfig;
    size?: number;
}

export default function AvatarDisplay({ config, size = 40 }: AvatarDisplayProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200">
            {/* Head */}
            <circle cx="100" cy="80" r="50" fill={config.skinTone} />

            {/* Hair */}
            {config.hairStyle === 'short' && (
                <path d="M 60 60 Q 100 30 140 60" fill={config.hairColor} />
            )}
            {config.hairStyle === 'long' && (
                <>
                    <path d="M 60 60 Q 100 30 140 60" fill={config.hairColor} />
                    <rect x="55" y="60" width="90" height="40" fill={config.hairColor} rx="10" />
                </>
            )}
            {config.hairStyle === 'curly' && (
                <>
                    <circle cx="70" cy="50" r="15" fill={config.hairColor} />
                    <circle cx="100" cy="40" r="15" fill={config.hairColor} />
                    <circle cx="130" cy="50" r="15" fill={config.hairColor} />
                </>
            )}
            {config.hairStyle === 'mohawk' && (
                <rect x="95" y="20" width="10" height="40" fill={config.hairColor} />
            )}

            {/* Eyes */}
            {config.eyeType === 'normal' && (
                <>
                    <circle cx="85" cy="75" r="5" fill="#000" />
                    <circle cx="115" cy="75" r="5" fill="#000" />
                </>
            )}
            {config.eyeType === 'happy' && (
                <>
                    <path d="M 80 75 Q 85 70 90 75" stroke="#000" strokeWidth="2" fill="none" />
                    <path d="M 110 75 Q 115 70 120 75" stroke="#000" strokeWidth="2" fill="none" />
                </>
            )}
            {config.eyeType === 'wink' && (
                <>
                    <circle cx="85" cy="75" r="5" fill="#000" />
                    <line x1="110" y1="75" x2="120" y2="75" stroke="#000" strokeWidth="2" />
                </>
            )}
            {config.eyeType === 'closed' && (
                <>
                    <line x1="80" y1="75" x2="90" y2="75" stroke="#000" strokeWidth="2" />
                    <line x1="110" y1="75" x2="120" y2="75" stroke="#000" strokeWidth="2" />
                </>
            )}
            {config.eyeType === 'surprised' && (
                <>
                    <circle cx="85" cy="75" r="7" fill="#000" />
                    <circle cx="115" cy="75" r="7" fill="#000" />
                </>
            )}

            {/* Mouth */}
            {config.mouthType === 'smile' && (
                <path d="M 80 95 Q 100 105 120 95" stroke="#000" strokeWidth="2" fill="none" />
            )}
            {config.mouthType === 'serious' && (
                <line x1="85" y1="100" x2="115" y2="100" stroke="#000" strokeWidth="2" />
            )}
            {config.mouthType === 'smirk' && (
                <path d="M 80 100 Q 95 105 110 100" stroke="#000" strokeWidth="2" fill="none" />
            )}
            {config.mouthType === 'laugh' && (
                <path d="M 75 95 Q 100 110 125 95" stroke="#000" strokeWidth="3" fill="none" />
            )}
            {config.mouthType === 'neutral' && (
                <ellipse cx="100" cy="100" rx="8" ry="5" fill="#000" />
            )}

            {/* Body */}
            <rect x="70" y="130" width="60" height="50" fill={config.clothingColor} rx="10" />
        </svg>
    );
}
