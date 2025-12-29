'use client';

import { useState } from 'react';

interface AvatarConfig {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    eyeType: string;
    mouthType: string;
    clothingColor: string;
}

interface AvatarCreatorProps {
    onComplete: (config: AvatarConfig) => void;
    onSkip: () => void;
}

const SKIN_TONES = ['#F9C9B6', '#E0AC69', '#C68642', '#8D5524', '#613D24'];
const HAIR_STYLES = ['short', 'long', 'curly', 'bald', 'mohawk'];
const HAIR_COLORS = ['#2C1B18', '#B55239', '#E8E1E1', '#F59797', '#6A4E42'];
const EYE_TYPES = ['normal', 'happy', 'wink', 'closed', 'surprised'];
const MOUTH_TYPES = ['smile', 'serious', 'smirk', 'laugh', 'neutral'];
const CLOTHING_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];

export default function AvatarCreator({ onComplete, onSkip }: AvatarCreatorProps) {
    const [config, setConfig] = useState<AvatarConfig>({
        skinTone: SKIN_TONES[0],
        hairStyle: HAIR_STYLES[0],
        hairColor: HAIR_COLORS[0],
        eyeType: EYE_TYPES[0],
        mouthType: MOUTH_TYPES[0],
        clothingColor: CLOTHING_COLORS[0],
    });

    const renderAvatar = () => {
        return (
            <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
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
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-black text-center mb-2">Create Your Avatar</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-8">Operator Identification</p>

                {/* Avatar Preview */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 mb-8">
                    {renderAvatar()}
                </div>

                {/* Customization Options */}
                <div className="space-y-6 mb-8">
                    {/* Skin Tone */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Skin Tone</label>
                        <div className="flex gap-2">
                            {SKIN_TONES.map(tone => (
                                <button
                                    key={tone}
                                    onClick={() => setConfig({ ...config, skinTone: tone })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.skinTone === tone ? 'border-blue-500 scale-110' : 'border-gray-700'}`}
                                    style={{ backgroundColor: tone }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Hair Style */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Hair Style</label>
                        <div className="flex gap-2 flex-wrap">
                            {HAIR_STYLES.map(style => (
                                <button
                                    key={style}
                                    onClick={() => setConfig({ ...config, hairStyle: style })}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${config.hairStyle === style
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hair Color */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Hair Color</label>
                        <div className="flex gap-2">
                            {HAIR_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setConfig({ ...config, hairColor: color })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.hairColor === color ? 'border-blue-500 scale-110' : 'border-gray-700'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Eyes */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Eyes</label>
                        <div className="flex gap-2 flex-wrap">
                            {EYE_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setConfig({ ...config, eyeType: type })}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${config.eyeType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mouth */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Mouth</label>
                        <div className="flex gap-2 flex-wrap">
                            {MOUTH_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setConfig({ ...config, mouthType: type })}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${config.mouthType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clothing */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Outfit</label>
                        <div className="flex gap-2">
                            {CLOTHING_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setConfig({ ...config, clothingColor: color })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.clothingColor === color ? 'border-blue-500 scale-110' : 'border-gray-700'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onSkip}
                        className="flex-1 bg-gray-800 text-gray-400 p-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-700 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={() => onComplete(config)}
                        className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
