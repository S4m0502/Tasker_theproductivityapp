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
            accessories: config.accessories as any,
            accessoriesProbability: config.accessoriesProbability,
            clothing: config.clothing as any,
            clothesColor: config.clothingColor as any,
            eyebrows: config.eyebrows as any,
            eyes: config.eyes as any,
            facialHair: config.facialHair as any,
            facialHairProbability: config.facialHairProbability,
            hairColor: config.hairColor as any,
            mouth: config.mouth as any,
            skin: config.skin as any,
            top: config.top as any,
        } as any);
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
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-sm mb-8 transition-colors shadow-lg shadow-purple-900/30"
                >
                    🎲 Randomize Avatar
                </button>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={() => onComplete({ ...config as AvatarConfig, username: username.trim() || 'Operator' })}
                        className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    );
}
