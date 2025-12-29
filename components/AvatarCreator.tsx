'use client';

import { useState, useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

interface AvatarConfig {
    username?: string;
    seed: string;
    backgroundColor: string[];
    accessories: string[];
    accessoriesProbability: number;
    clothing: string[];
    clothingColor: string[];
    eyebrows: string[];
    eyes: string[];
    facialHair: string[];
    facialHairProbability: number;
    hairColor: string[];
    mouth: string[];
    skin: string[];
    top: string[];
}

interface AvatarCreatorProps {
    onComplete: (config: AvatarConfig) => void;
    onSkip: () => void;
}

const SKIN_COLORS = ['ffdbb4', 'edb98a', 'd08b5b', 'ae5d29', '614335'];
const HAIR_COLORS = ['2c1b18', '4a312c', '724133', 'a55728', 'b58143', 'c93305', 'd6b370', 'e16381'];
const CLOTHING_COLORS = ['3c4f5c', '5199e4', '25557c', 'e6e6e6', '929598', 'a7ffc4', 'ffdeb5', 'ffafb9', 'ffffb1'];
const HAIR_STYLES = ['bigHair', 'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro', 'froAndBand', 'longButNotTooLong', 'miaWallace', 'shaggy', 'shaggyMullet', 'shavedSides', 'straight01', 'straight02', 'straightAndStrand'];
const FACIAL_HAIR = ['beardLight', 'beardMajestic', 'beardMedium', 'moustacheFancy', 'moustacheMagnum'];
const ACCESSORIES = ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'];
const CLOTHING = ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'];

export default function AvatarCreator({ onComplete, onSkip }: AvatarCreatorProps) {
    const [username, setUsername] = useState('');
    const [config, setConfig] = useState<Partial<AvatarConfig>>({
        seed: Math.random().toString(36).substring(7),
        backgroundColor: ['65c9ff'],
        skin: [SKIN_COLORS[0]],
        hairColor: [HAIR_COLORS[0]],
        clothingColor: [CLOTHING_COLORS[0]],
        top: [HAIR_STYLES[0]],
        clothing: [CLOTHING[0]],
        accessories: [],
        accessoriesProbability: 0,
        facialHair: [],
        facialHairProbability: 0,
    });

    const avatarSvg = useMemo(() => {
        const avatar = createAvatar(avataaars, {
            seed: config.seed,
            backgroundColor: config.backgroundColor,
            accessories: config.accessories,
            accessoriesProbability: config.accessoriesProbability,
            clothing: config.clothing,
            clothingColor: config.clothingColor,
            eyebrows: config.eyebrows,
            eyes: config.eyes,
            facialHair: config.facialHair,
            facialHairProbability: config.facialHairProbability,
            hairColor: config.hairColor,
            mouth: config.mouth,
            skin: config.skin,
            top: config.top,
        });
        return avatar.toString();
    }, [config]);

    const randomize = () => {
        setConfig({
            seed: Math.random().toString(36).substring(7),
            backgroundColor: ['65c9ff'],
            skin: [SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)]],
            hairColor: [HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)]],
            clothingColor: [CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)]],
            top: [HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)]],
            clothing: [CLOTHING[Math.floor(Math.random() * CLOTHING.length)]],
            accessories: Math.random() > 0.5 ? [ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)]] : [],
            accessoriesProbability: Math.random() > 0.5 ? 100 : 0,
            facialHair: Math.random() > 0.7 ? [FACIAL_HAIR[Math.floor(Math.random() * FACIAL_HAIR.length)]] : [],
            facialHairProbability: Math.random() > 0.7 ? 100 : 0,
        });
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col items-center p-6 animate-in fade-in duration-500 overflow-y-auto">
            <div className="max-w-md w-full my-8">
                <h1 className="text-3xl font-black text-center mb-2">Create Your Avatar</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-4">Operator Identification</p>

                {/* Username Input */}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-3 text-center text-sm focus:border-blue-500 outline-none mb-6"
                    maxLength={20}
                />

                {/* Avatar Preview */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 mb-6">
                    <div
                        className="w-48 h-48 mx-auto"
                        dangerouslySetInnerHTML={{ __html: avatarSvg }}
                    />
                </div>

                {/* Randomize Button */}
                <button
                    onClick={randomize}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-2xl font-bold uppercase tracking-widest text-xs mb-6 transition-colors"
                >
                    🎲 Randomize
                </button>

                {/* Customization Options */}
                <div className="space-y-6 mb-8">
                    {/* Skin Tone */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Skin Tone</label>
                        <div className="flex gap-2 flex-wrap">
                            {SKIN_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setConfig({ ...config, skin: [color] })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.skin?.[0] === color ? 'border-blue-500 scale-110' : 'border-gray-700'}`}
                                    style={{ backgroundColor: `#${color}` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Hair Style */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Hair Style</label>
                        <div className="grid grid-cols-3 gap-2">
                            {HAIR_STYLES.slice(0, 9).map(style => (
                                <button
                                    key={style}
                                    onClick={() => setConfig({ ...config, top: [style] })}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${config.top?.[0] === style
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {style.replace(/([A-Z])/g, ' $1').trim()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hair Color */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Hair Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {HAIR_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setConfig({ ...config, hairColor: [color] })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.hairColor?.[0] === color ? 'border-blue-500 scale-110' : 'border-gray-700'}`}
                                    style={{ backgroundColor: `#${color}` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Clothing */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Outfit</label>
                        <div className="grid grid-cols-3 gap-2">
                            {CLOTHING.slice(0, 6).map(item => (
                                <button
                                    key={item}
                                    onClick={() => setConfig({ ...config, clothing: [item] })}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${config.clothing?.[0] === item
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {item.replace(/([A-Z])/g, ' $1').trim()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clothing Color */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Outfit Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {CLOTHING_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setConfig({ ...config, clothingColor: [color] })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.clothingColor?.[0] === color ? 'border-blue-500 scale-110' : 'border-gray-700'}`}
                                    style={{ backgroundColor: `#${color}` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Accessories */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Accessories</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setConfig({ ...config, accessories: [], accessoriesProbability: 0 })}
                                className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${config.accessoriesProbability === 0
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                None
                            </button>
                            {ACCESSORIES.slice(0, 5).map(item => (
                                <button
                                    key={item}
                                    onClick={() => setConfig({ ...config, accessories: [item], accessoriesProbability: 100 })}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${config.accessories?.[0] === item
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {item}
                                </button>
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
                        onClick={() => onComplete({ ...config as AvatarConfig, username: username.trim() || 'Operator' })}
                        className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
